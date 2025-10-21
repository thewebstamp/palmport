"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useAlert } from "@/contexts/AlertContext";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Interface for Product
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  original_price: number | null;
  size: string;
  image_url: string;
  features: string[];
  in_stock: boolean;
}

interface ShippingSettings {
  shipping_fee: number;
  free_shipping_threshold: number;
}

export default function ShopSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [shippingSettings, setShippingSettings] = useState<ShippingSettings>({
    shipping_fee: 1000,
    free_shipping_threshold: 5000
  });
  const { user } = useAuth();
  const { showAlert, showConfirm } = useAlert();
  const router = useRouter();

  // Fetch products and shipping settings
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, shippingResponse] = await Promise.all([
          fetch(`${apiUrl}/api/products`),
          fetch(`${apiUrl}/api/shipping/settings`)
        ]);

        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          setProducts(productsData);

          // Initialize quantities for all products to 1 by default
          const initialQuantities: { [key: number]: number } = {};
          productsData.forEach((product: Product) => {
            initialQuantities[product.id] = 1;
          });
          setQuantities(initialQuantities);
        }

        if (shippingResponse.ok) {
          const shippingData = await shippingResponse.json();
          setShippingSettings(shippingData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateQuantity = (productId: number, change: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + change)
    }));
  };

  const addToCart = async (productId: number) => {
    const quantity = quantities[productId];
    const product = products.find(p => p.id === productId);

    if (!product) return;

    if (!user) {
      // Save the intended cart action as pending
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        size: product.size,
        image: product.image_url,
        quantity: quantity,
        total: product.price * quantity
      };

      // Save to pending cart
      const pendingCart = JSON.parse(localStorage.getItem('palmport-pending-cart') || '[]');
      const existingIndex = pendingCart.findIndex((item: any) => item.id === productId);

      if (existingIndex > -1) {
        pendingCart[existingIndex].quantity += quantity;
        pendingCart[existingIndex].total = pendingCart[existingIndex].price * pendingCart[existingIndex].quantity;
      } else {
        pendingCart.push(cartItem);
      }

      localStorage.setItem('palmport-pending-cart', JSON.stringify(pendingCart));

      const shouldLogin = await showConfirm({
        title: 'Login Required',
        message: 'Please login to add items to cart. Would you like to login now?',
        confirmText: 'Yes, Login',
        cancelText: 'Cancel',
        type: 'warning'
      });

      if (shouldLogin) {
        router.push(`/auth/login?redirect=${encodeURIComponent('/cart')}`);
        return;
      }
      return;
    }

    // User is logged in - add directly to cart
    if (quantity > 0) {
      // Get existing cart
      const existingCart = JSON.parse(localStorage.getItem('palmport-cart') || '[]');

      // Check if product already exists in cart
      const existingItemIndex = existingCart.findIndex((item: any) => item.id === productId);

      let updatedCart;
      if (existingItemIndex > -1) {
        // Update existing item quantity
        updatedCart = [...existingCart];
        updatedCart[existingItemIndex].quantity += quantity;
        updatedCart[existingItemIndex].total = updatedCart[existingItemIndex].price * updatedCart[existingItemIndex].quantity;
      } else {
        // Add new item
        const cartItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          size: product.size,
          image: product.image_url,
          quantity: quantity,
          total: product.price * quantity
        };
        updatedCart = [...existingCart, cartItem];
      }

      localStorage.setItem('palmport-cart', JSON.stringify(updatedCart));

      // Show success message
      showAlert({
        title: 'Added to Cart! 🎉',
        message: `Added ${quantity} ${product.name} to your cart`,
        type: 'success',
        duration: 3000
      });

      // Reset quantity for this product back to 1
      setQuantities(prev => ({
        ...prev,
        [productId]: 1
      }));

      // Redirect to cart page after adding
      setTimeout(() => {
        router.push('/cart');
      }, 1000);
    } else {
      showAlert({
        title: 'Select Quantity',
        message: 'Please choose the quantity first using the + button',
        type: 'info',
        duration: 3000
      });
    }
  };

  // Show loading state
  if (loading) {
    return (
      <section id="shoppage" className="py-20 bg-gradient-to-b from-white to-[#fff8f2] relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-4 border-[#d84727] border-t-transparent rounded-full"
            />
          </div>
        </div>
      </section>
    );
  }

  // Show empty state if no products
  if (products.length === 0) {
    return (
      <section id="shop" className="py-20 bg-gradient-to-b from-white to-[#fff8f2] relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-[#5c3b28] mb-4">No Products Available</h2>
          <p className="text-[#5c3b28]/70">Check back later for our premium palm oil products.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="shop" className="py-20 pt-34 bg-gradient-to-b from-white to-[#fff8f2] relative overflow-hidden">
      {/* Animated Palm Leaves Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-10 left-5 opacity-10"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
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
            y: [0, 15, 0],
            rotate: [0, -3, 0],
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

        <motion.div
          className="absolute top-1/3 right-1/4 opacity-3"
          animate={{
            y: [0, -10, 0],
            rotate: [0, 2, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          <Image
            src="/palmleaf.png"
            alt="Palm Leaf"
            width={80}
            height={120}
            className="object-contain"
          />
        </motion.div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.span
            className="inline-block px-4 py-2 bg-[#2f7a32]/10 text-[#2f7a32] rounded-full text-sm font-semibold mb-4"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            viewport={{ once: true }}
          >
            Premium Selection
          </motion.span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#5c3b28] mb-6">
            Choose Your <span className="text-[#d84727]">Pure Goodness</span>
          </h2>
          <p className="text-xl text-[#5c3b28]/70 max-w-2xl mx-auto">
            Each bottle carries the rich heritage of Nigerian palm oil, carefully sourced and traditionally processed.
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group relative bg-white rounded-2xl shadow-xl overflow-hidden border border-[#ffe8d6] hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
            >
              {/* Discount Badge - Only show if there's an original price */}
              {product.original_price && product.original_price > product.price && (
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  whileInView={{ scale: 1, rotate: -45 }}
                  transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                  viewport={{ once: true }}
                  className="absolute top-4 right-4 z-20"
                >
                  <div className="bg-[#d84727] text-white px-3 py-1 rounded-lg font-bold transform rotate-12 shadow-lg text-sm">
                    Save ₦{(product.original_price - product.price).toLocaleString()}
                  </div>
                </motion.div>
              )}

              {/* Product Image with Marble Shadow Effect */}
              <div className="relative h-64 bg-gradient-to-br from-[#fff8f2] to-[#ffe8d6] flex-shrink-0 overflow-hidden">
                {/* Marble Platform Base */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-transparent backdrop-blur-sm">
                  {/* Marble Veins */}
                  <div className="absolute top-2 left-4 w-12 h-1 bg-gray-200/40 rounded-full"></div>
                  <div className="absolute top-4 right-6 w-8 h-0.5 bg-gray-200/30 rounded-full"></div>
                  <div className="absolute top-6 left-8 w-6 h-0.5 bg-gray-200/20 rounded-full"></div>
                  <div className="absolute top-3 left-1/4 w-10 h-0.5 bg-gray-200/25 rounded-full"></div>
                </div>

                {/* Shadow Under Product */}
                <motion.div
                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-4 bg-black/10 rounded-full blur-sm"
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  viewport={{ once: true }}
                />

                {/* Product Image Container */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center p-6"
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative w-40 h-40 transform perspective-1000">
                    {/* Product Image */}
                    <motion.div
                      className="relative w-full h-full"
                      whileHover={{ rotateY: 5, rotateX: -2 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Image
                        src={product.image_url || "/placeholder-oil.png"}
                        alt={product.name}
                        fill
                        className="object-contain drop-shadow-2xl"
                        sizes="160px"
                        style={{
                          filter: 'drop-shadow(0 8px 20px rgba(0, 0, 0, 0.15))'
                        }}
                      />
                    </motion.div>
                  </div>
                </motion.div>

                {/* Size Badge */}
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full z-10"
                >
                  <span className="font-bold text-[#5c3b28] text-sm">{product.size}</span>
                </motion.div>
              </div>

              {/* Product Info */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="mb-4 flex-grow">
                  <h3 className="text-xl font-bold text-[#5c3b28] mb-2">{product.name}</h3>
                  <p className="text-[#5c3b28]/70 text-sm leading-relaxed mb-4">{product.description}</p>

                  {/* Features */}
                  {product.features && product.features.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {product.features.map((feature, featureIndex) => (
                          <motion.span
                            key={featureIndex}
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 * featureIndex + index * 0.1 }}
                            viewport={{ once: true }}
                            className="inline-block px-2 py-1 bg-[#2f7a32]/10 text-[#2f7a32] rounded-full text-xs"
                          >
                            {feature}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Pricing & Actions Container */}
                <div className="mt-auto space-y-4">
                  {/* Pricing */}
                  <div className="flex items-center gap-3">
                    <motion.span
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: 0.4 + index * 0.1, type: "spring" }}
                      viewport={{ once: true }}
                      className="text-2xl font-bold text-[#d84727]"
                    >
                      ₦{product.price.toLocaleString()}
                    </motion.span>
                    {product.original_price && product.original_price > product.price && (
                      <motion.span
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ delay: 0.6 + index * 0.1, type: "spring" }}
                        viewport={{ once: true }}
                        className="text-sm text-[#5c3b28]/50 line-through"
                      >
                        ₦{product.original_price.toLocaleString()}
                      </motion.span>
                    )}
                  </div>

                  {/* Quantity & Action */}
                  <div className="flex items-center gap-3">
                    {/* Quantity Selector */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-2 bg-[#fff8f2] rounded-lg p-1"
                    >
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => updateQuantity(product.id, -1)}
                        className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-[#d84727] font-bold hover:bg-[#d84727] hover:text-white transition-colors text-sm"
                      >
                        -
                      </motion.button>
                      <span className="w-6 text-center font-bold text-[#5c3b28] text-sm">
                        {quantities[product.id] || 1}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => updateQuantity(product.id, 1)}
                        className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-[#d84727] font-bold hover:bg-[#d84727] hover:text-white transition-colors text-sm"
                      >
                        +
                      </motion.button>
                    </motion.div>

                    {/* Action Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => addToCart(product.id)}
                      className="flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 bg-[#2f7a32] text-white hover:bg-[#1e4d20]"
                    >
                      Add to Cart
                    </motion.button>
                  </div>

                  {/* Stock Status */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    viewport={{ once: true }}
                    className={`flex items-center gap-2 text-xs ${product.in_stock ? 'text-[#2f7a32]' : 'text-[#d84727]'
                      }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${product.in_stock ? 'bg-[#2f7a32]' : 'bg-[#d84727]'
                      }`}></div>
                    {product.in_stock ? 'In Stock - Ready to Ship' : 'Out of Stock'}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-6 mt-12 pt-8 border-t border-[#ffe8d6]"
        >
          {[
            { icon: "🚚", text: `Free Shipping Over ₦${shippingSettings.free_shipping_threshold?.toLocaleString() || '5000'}` },
            { icon: "🔒", text: "Secure Payment" },
            { icon: "🌱", text: "100% Natural" },
            { icon: "📞", text: "24/7 Support" }
          ].map((item, index) => (
            <motion.div
              key={item.text}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              viewport={{ once: true }}
              className="flex items-center gap-2 text-[#5c3b28]"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-semibold text-sm">{item.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}