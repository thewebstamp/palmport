"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useAlert } from "@/contexts/AlertContext";
import OrderHistory from "@/components/OrderHistory";


const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface CartItem {
  id: number;
  name: string;
  price: number;
  size: string;
  image: string;
  quantity: number;
  total: number;
}

interface ShippingSettings {
  shipping_fee: number;
  free_shipping_threshold: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [shippingSettings, setShippingSettings] = useState<ShippingSettings>({
    shipping_fee: 1000,
    free_shipping_threshold: 5000
  });
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState<'cart' | 'orders'>('cart');
  const { user, logout, loading: authLoading } = useAuth();
  const { showAlert } = useAlert();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);

    // Only redirect if auth check is complete and no user
    if (!authLoading && !user) {
      router.push('/auth/login?redirect=/cart');
      return;
    }

    // Load cart items
    const savedCart = localStorage.getItem('palmport-cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }

    // Load shipping settings
    fetchShippingSettings();
  }, [user, authLoading, router]);

  const fetchShippingSettings = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/shipping/settings`);
      if (response.ok) {
        const settings = await response.json();
        setShippingSettings(settings);
      }
    } catch (error) {
      console.error('Error fetching shipping settings:', error);
    }
  };

  const updateQuantity = (id: number, change: number) => {
    const updatedCart = cartItems.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(0, item.quantity + change);
        if (newQuantity === 0) {
          return null;
        }
        return { ...item, quantity: newQuantity, total: item.price * newQuantity };
      }
      return item;
    }).filter(Boolean) as CartItem[];

    setCartItems(updatedCart);
    localStorage.setItem('palmport-cart', JSON.stringify(updatedCart));

    if (change > 0) {
      showAlert({
        title: 'Cart Updated',
        message: 'Item quantity increased',
        type: 'success',
        duration: 2000
      });
    }
  };

  const removeItem = (id: number) => {
    const item = cartItems.find(item => item.id === id);
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('palmport-cart', JSON.stringify(updatedCart));

    showAlert({
      title: 'Item Removed',
      message: `${item?.name} has been removed from your cart`,
      type: 'info',
      duration: 3000
    });
  };

  const clearCart = () => {
    if (cartItems.length > 0) {
      setCartItems([]);
      localStorage.removeItem('palmport-cart');

      showAlert({
        title: 'Cart Cleared',
        message: 'All items have been removed from your cart',
        type: 'info',
        duration: 3000
      });
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
  const shipping = subtotal >= shippingSettings.free_shipping_threshold ? 0 : shippingSettings.shipping_fee;
  const total = Number(subtotal) + Number(shipping);

  // Show loading while checking auth
  if (authLoading || !isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fffaf5] via-[#fff0e8] to-[#ffe8d6] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-[#d84727] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // Show login prompt if no user (after auth check)
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fffaf5] via-[#fff0e8] to-[#ffe8d6] flex items-center justify-center p-4 pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md w-full border border-[#ffe8d6]"
        >
          <div className="w-20 h-20 bg-[#fff8f2] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🔒</span>
          </div>
          <h2 className="text-2xl font-bold text-[#5c3b28] mb-2">Login Required</h2>
          <p className="text-[#5c3b28]/70 mb-6">Please login to view your cart</p>
          <Link href="/auth/login?redirect=/cart">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#d84727] text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Login Now
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const CartContent = () => {
    if (cartItems.length === 0) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md w-full border border-[#ffe8d6] relative z-10"
        >
          <div className="w-20 h-20 bg-[#fff8f2] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🛒</span>
          </div>
          <h2 className="text-2xl font-bold text-[#5c3b28] mb-2">Your Cart is Empty</h2>
          <p className="text-[#5c3b28]/70 mb-6">Add some pure Nigerian goodness to your cart!</p>
          <Link href="/shop">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#d84727] text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Continue Shopping
            </motion.button>
          </Link>
        </motion.div>
      );
    }

    return (
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {/* Clear Cart Button */}
          <div className="flex justify-end">
            <motion.button
              onClick={clearCart}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="text-red-500 hover:text-red-700 font-medium text-sm bg-red-50 px-3 py-1 rounded-lg transition-colors"
            >
              Clear Cart
            </motion.button>
          </div>

          {cartItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-[#ffe8d6] hover:shadow-xl transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                {/* Product Image */}
                <div className="flex-shrink-0">
                  <div className="overflow-hidden w-20 h-20 bg-gradient-to-br from-[#fff8f2] to-[#ffe8d6] rounded-xl flex items-center justify-center">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={60}
                      height={60}
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-semibold text-[#5c3b28] text-lg mb-1">{item.name}</h3>
                  <p className="text-[#5c3b28]/70 text-sm mb-2">{item.size}</p>
                  <p className="text-[#d84727] font-bold text-lg">₦{item.price.toLocaleString()}</p>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-center sm:justify-start gap-3 mt-3">
                    <div className="flex items-center gap-2 bg-[#fff8f2] rounded-lg p-1">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-[#d84727] font-bold hover:bg-[#d84727] hover:text-white transition-colors text-sm"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold text-[#5c3b28] text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-[#d84727] font-bold hover:bg-[#d84727] hover:text-white transition-colors text-sm"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium bg-red-50 px-3 py-1 rounded-lg transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="text-center sm:text-right">
                  <p className="text-lg font-bold text-[#5c3b28]">₦{item.total.toLocaleString()}</p>
                  <p className="text-[#5c3b28]/70 text-sm">{item.quantity} item{item.quantity > 1 ? 's' : ''}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-6 h-fit border border-[#ffe8d6] sticky top-32"
        >
          <h3 className="text-xl font-bold text-[#5c3b28] mb-4">Order Summary</h3>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-[#5c3b28]">
              <span>Subtotal</span>
              <span className="font-semibold">₦{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[#5c3b28]">
              <span>Shipping</span>
              <span className="font-semibold">
                {shipping === 0 ? (
                  <span className="text-green-600">Free</span>
                ) : (
                  `₦${shipping.toLocaleString()}`
                )}
              </span>
            </div>

            {subtotal >= shippingSettings.free_shipping_threshold ? (
              <div className="text-green-600 text-sm bg-green-50 p-2 rounded-lg text-center">
                🎉 You qualify for free shipping!
              </div>
            ) : (
              <div className="text-[#5c3b28]/70 text-sm bg-[#fff8f2] p-2 rounded-lg text-center">
                Add ₦{(shippingSettings.free_shipping_threshold - subtotal).toLocaleString()} more for free shipping
              </div>
            )}

            <div className="border-t border-[#ffe8d6] pt-3">
              <div className="flex justify-between text-lg font-bold text-[#5c3b28]">
                <span>Total</span>
                <span className="text-[#d84727]">₦{total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              href="/checkout"
              scroll={true}
              onClick={() => {
                setTimeout(() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 100);
              }}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#d84727] text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Proceed to Checkout
              </motion.button>
            </Link>

            <Link href="/shop">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-2 w-full border border-[#5c3b28] text-[#5c3b28] py-3 px-6 rounded-xl font-semibold hover:bg-[#5c3b28] hover:text-white transition-all duration-300"
              >
                Continue Shopping
              </motion.button>
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="mt-6 pt-4 border-t border-[#ffe8d6]">
            <div className="flex flex-wrap justify-center gap-4 text-xs text-[#5c3b28]/70">
              <div className="flex items-center gap-1">
                <span>🔒</span>
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-1">
                <span>🚚</span>
                <span>Fast Delivery</span>
              </div>
              <div className="flex items-center gap-1">
                <span>💳</span>
                <span>Paystack</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fffaf5] via-[#fff0e8] to-[#ffe8d6] pt-32 pb-16 relative overflow-hidden">
      {/* Animated Palm Leaves Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-5 opacity-10"
          animate={{
            y: [0, -15, 0],
            rotate: [0, 3, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Image
            src="/palmleaf.png"
            alt="Palm Leaf"
            width={120}
            height={180}
            className="object-contain"
          />
        </motion.div>

        <motion.div
          className="absolute bottom-20 right-8 opacity-5"
          animate={{
            y: [0, 10, 0],
            rotate: [0, -2, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        >
          <Image
            src="/palmleaf.png"
            alt="Palm Leaf"
            width={100}
            height={150}
            className="object-contain"
          />
        </motion.div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header with User Info and Logout */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold text-[#5c3b28] mb-2">
                {activeTab === 'cart' ? 'Your Cart' : 'Order History'}
              </h1>
              <p className="text-[#5c3b28]/70">
                {activeTab === 'cart' ? 'Review your selected items' : 'Track your purchases and order status'}
              </p>
            </div>

            {/* User Info and Logout - Always show when user is logged in */}
            {user && (
              <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-[#ffe8d6]">
                <div className="text-right">
                  <p className="font-semibold text-[#5c3b28] text-sm">Welcome, {user.name}</p>
                  <p className="text-[#5c3b28]/70 text-xs">{user.email}</p>
                </div>
                <motion.button
                  onClick={logout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                >
                  Logout
                </motion.button>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex border-b border-[#ffe8d6] mb-8">
            <button
              onClick={() => setActiveTab('cart')}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${activeTab === 'cart'
                  ? 'border-[#d84727] text-[#d84727]'
                  : 'border-transparent text-[#5c3b28]/70 hover:text-[#5c3b28]'
                }`}
            >
              Shopping Cart ({cartItems.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${activeTab === 'orders'
                  ? 'border-[#d84727] text-[#d84727]'
                  : 'border-transparent text-[#5c3b28]/70 hover:text-[#5c3b28]'
                }`}
            >
              Order History
            </button>
          </div>

          {/* Content */}
          {activeTab === 'cart' ? (
            <CartContent />
          ) : (
            <OrderHistory userId={user?.id || 0} />
          )}
        </motion.div>
      </div>
    </div>
  );
}