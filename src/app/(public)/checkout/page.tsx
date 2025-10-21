"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useAlert } from "@/contexts/AlertContext";
import Image from "next/image";

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

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [shippingSettings, setShippingSettings] = useState<ShippingSettings>({
    shipping_fee: 1000,
    free_shipping_threshold: 5000
  });
  const [formData, setFormData] = useState({
    customer_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [whatsappLoading, setWhatsappLoading] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const { user, logout } = useAuth();
  const { showAlert } = useAlert();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    // Load cart items
    const savedCart = localStorage.getItem('palmport-cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }

    // Load shipping settings
    fetchShippingSettings();

    // Pre-fill form with user data
    if (user) {
      setFormData(prev => ({
        ...prev,
        customer_name: user.name,
        email: user.email
      }));
    }
  }, [user, router]);

  const fetchShippingSettings = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/shipping/settings');
      if (response.ok) {
        const settings = await response.json();
        setShippingSettings(settings);
      }
    } catch (error) {
      console.error('Error fetching shipping settings:', error);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
  const shipping = subtotal >= shippingSettings.free_shipping_threshold ? 0 : shippingSettings.shipping_fee;
  const total = Number(subtotal) + Number(shipping);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateForm = () => {
    const requiredFields = ['customer_name', 'email', 'phone', 'address', 'city', 'state'];
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        showAlert({
          title: 'Missing Information',
          message: `Please fill in all required fields including ${field.replace('_', ' ')}`,
          type: 'error',
          duration: 5000
        });
        return false;
      }
    }
    return true;
  };

  const initializePaystackPayment = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // First create the order
      const orderData = {
        ...formData,
        items: cartItems,
        subtotal,
        shipping,
        total,
        payment_reference: `PALM-${Date.now()}-${Math.floor(10000 + Math.random() * 90000)}`,
        batch_id: null,
        notes: formData.notes
      };

      const token = localStorage.getItem('palmport-token');
      const orderResponse = await fetch('http://localhost:4000/api/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (!orderResponse.ok) {
        const errorText = await orderResponse.text();
        throw new Error(`Failed to create order: ${errorText}`);
      }

      const order = await orderResponse.json();
      console.log('Order created successfully:', order);

      // Initialize Paystack payment
      const paystackResponse = await fetch('http://localhost:4000/api/payments/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          amount: total * 100, // Convert to kobo
          reference: order.order_number,
          metadata: {
            order_id: order.id,
            customer_name: formData.customer_name,
            custom_fields: [
              {
                display_name: "Customer Name",
                variable_name: "customer_name",
                value: formData.customer_name
              },
              {
                display_name: "Order Number",
                variable_name: "order_number",
                value: order.order_number
              }
            ]
          }
        })
      });

      if (!paystackResponse.ok) {
        const errorText = await paystackResponse.text();
        console.error('Paystack initialization failed:', errorText);
        throw new Error(`Payment initialization failed: ${errorText}`);
      }

      const paymentData = await paystackResponse.json();

      // Clear cart
      localStorage.removeItem('palmport-cart');
      setCartItems([]);

      // Redirect to Paystack
      window.location.href = paymentData.data.authorization_url;
    } catch (error) {
      console.error('Payment initialization failed:', error);

      let errorMessage = 'Payment initialization failed. Please try again.';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      showAlert({
        title: 'Payment Failed',
        message: errorMessage,
        type: 'error',
        duration: 5000
      });
    } finally {
      setLoading(false);
    }

  };

  const createWhatsAppOrder = async () => {
    if (!validateForm()) return;

    setWhatsappLoading(true);
    try {
      const orderData = {
        ...formData,
        items: cartItems,
        subtotal,
        shipping,
        total,
        notes: formData.notes
      };

      console.log('Creating WhatsApp order with data:', orderData);

      const token = localStorage.getItem('palmport-token');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      const response = await fetch('http://localhost:4000/api/orders/whatsapp-order', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      console.log('WhatsApp order response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('WhatsApp order failed with response:', errorText);

        let errorMessage = 'Failed to create order. Please try again.';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          errorMessage = errorText || errorMessage;
        }

        throw new Error(errorMessage);
      }

      const order = await response.json();
      console.log('WhatsApp order created successfully:', order);

      // Clear cart
      localStorage.removeItem('palmport-cart');
      setCartItems([]);

      // Show success message with WhatsApp instructions
      showAlert({
        title: 'Order Created Successfully!',
        message: 'Your order has been saved. We will contact you through the Whatsapp number you provided',
        type: 'success',
        duration: 10000
      });

      // Open WhatsApp with pre-filled message after a short delay
      setTimeout(() => {
        if (order.whatsapp_info && order.whatsapp_info.whatsapp_url) {
          // Open WhatsApp in a new tab
          window.open(order.whatsapp_info.whatsapp_url, '_blank');

          // Show additional instructions
          showAlert({
            title: 'Open WhatsApp',
            message: 'WhatsApp should open with your order details. Please review and send the message to complete your order.',
            type: 'info',
            duration: 8000
          });
        }

        // Redirect to orders page
        setTimeout(() => {
          router.push('/orders');
        }, 3000);
      }, 2000);

    } catch (error: any) {
      console.error('WhatsApp order creation failed:', error);

      let userMessage = 'Failed to place order. Please try again.';
      if (error.message.includes('authentication') || error.message.includes('token')) {
        userMessage = 'Please log in again to place your order.';
        setTimeout(() => router.push('/auth/login'), 2000);
      } else if (error.message) {
        userMessage = error.message;
      }

      showAlert({
        title: 'Order Failed',
        message: userMessage,
        type: 'error',
        duration: 5000
      });
    } finally {
      setWhatsappLoading(false);
    }
  };

  const proceedToPayment = () => {
    if (!validateForm()) return;
    setShowPaymentOptions(true);
  };

  if (cartItems.length === 0 && !showPaymentOptions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fffaf5] via-[#fff0e8] to-[#ffe8d6] flex items-center justify-center p-4 pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md w-full border border-[#ffe8d6]"
        >
          <div className="w-20 h-20 bg-[#fff8f2] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🛒</span>
          </div>
          <h2 className="text-2xl font-bold text-[#5c3b28] mb-2">Your Cart is Empty</h2>
          <p className="text-[#5c3b28]/70 mb-6">Add some items to proceed to checkout</p>
          <button
            onClick={() => router.push('/#shop')}
            className="bg-[#d84727] text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Continue Shopping
          </button>
        </motion.div>
      </div>
    );
  }

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
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold text-[#5c3b28] mb-2">
                {showPaymentOptions ? 'Choose Payment Method' : 'Checkout'}
              </h1>
              <p className="text-[#5c3b28]/70">
                {showPaymentOptions ? 'Select how you want to pay' : 'Complete your purchase'}
              </p>
            </div>

            {/* User Info and Logout */}
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

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            {!showPaymentOptions && (
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-2xl shadow-lg p-6 border border-[#ffe8d6]"
                >
                  <h3 className="text-xl font-bold text-[#5c3b28] mb-4">Shipping Information</h3>

                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#5c3b28] mb-1">Full Name *</label>
                        <input
                          type="text"
                          name="customer_name"
                          value={formData.customer_name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-[#ffe8d6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d84727] focus:border-transparent"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#5c3b28] mb-1">Phone *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-[#ffe8d6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d84727] focus:border-transparent"
                          placeholder="08012345678"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#5c3b28] mb-1">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-[#ffe8d6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d84727] focus:border-transparent"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#5c3b28] mb-1">Address *</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-[#ffe8d6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d84727] focus:border-transparent"
                        placeholder="123 Main Street"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#5c3b28] mb-1">City *</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-[#ffe8d6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d84727] focus:border-transparent"
                          placeholder="Lagos"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#5c3b28] mb-1">State *</label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-[#ffe8d6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d84727] focus:border-transparent"
                          placeholder="Lagos"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#5c3b28] mb-1">Order Notes (Optional)</label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-[#ffe8d6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d84727] focus:border-transparent"
                        placeholder="Any special instructions..."
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Order Summary & Payment Options */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Order Items */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#ffe8d6]">
                <h3 className="text-xl font-bold text-[#5c3b28] mb-4">Order Items</h3>
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 py-2 border-b border-[#ffe8d6] last:border-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#fff8f2] to-[#ffe8d6] rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[#5c3b28] text-sm truncate">{item.name}</p>
                        <p className="text-[#5c3b28]/70 text-xs">{item.size}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#5c3b28]">₦{item.total.toLocaleString()}</p>
                        <p className="text-[#5c3b28]/70 text-xs">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Total & Payment Options */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-[#ffe8d6]"
              >
                <h3 className="text-xl font-bold text-[#5c3b28] mb-4">Order Summary</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-[#5c3b28]">
                    <span>Subtotal</span>
                    <span>₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[#5c3b28]">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `₦${shipping.toLocaleString()}`
                      )}
                    </span>
                  </div>
                  {subtotal >= shippingSettings.free_shipping_threshold && (
                    <div className="text-green-600 text-sm">
                      🎉 Free shipping on orders over ₦{shippingSettings.free_shipping_threshold.toLocaleString()}
                    </div>
                  )}
                  <div className="border-t border-[#ffe8d6] pt-3">
                    <div className="flex justify-between text-lg font-bold text-[#5c3b28]">
                      <span>Total</span>
                      <span>₦{total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {!showPaymentOptions ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={proceedToPayment}
                    className="w-full bg-[#d84727] text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Proceed to Payment
                  </motion.button>
                ) : (
                  <div className="space-y-4">
                    {/* Online Payment Option */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={initializePaystackPayment}
                      disabled={loading}
                      className="w-full bg-[#d84727] text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <span>💳</span>
                          Pay ₦{total.toLocaleString()} with Paystack
                        </>
                      )}
                    </motion.button>

                    {/* WhatsApp Order Option */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={createWhatsAppOrder}
                      disabled={whatsappLoading}
                      className="w-full bg-[#25D366] text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      {whatsappLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Creating Order...
                        </>
                      ) : (
                        <>
                          <span>💬</span>
                          Complete Order via WhatsApp
                        </>
                      )}
                    </motion.button>

                    <div className="text-center text-sm text-gray-600">
                      <p>Prefer to talk to someone? Choose WhatsApp for personalized service!</p>
                    </div>

                    <button
                      onClick={() => setShowPaymentOptions(false)}
                      className="w-full text-[#5c3b28] hover:text-[#d84727] font-medium py-2"
                    >
                      ← Back to Shipping Details
                    </button>
                  </div>
                )}

                {!showPaymentOptions && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => router.push('/cart')}
                      className="text-[#5c3b28] hover:text-[#d84727] font-medium"
                    >
                      ← Back to Cart
                    </button>
                  </div>
                )}
              </motion.div>

              {/* WhatsApp Order Benefits */}
              {!showPaymentOptions && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-green-50 border border-green-200 rounded-2xl p-6"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">💬</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-800 mb-2">Prefer WhatsApp Support?</h4>
                      <p className="text-green-700 text-sm">
                        Complete your order and we'll reach out to you on WhatsApp! Our team will
                        contact you using the information provided during checkout to finalize your order.
                      </p>
                      <ul className="text-green-700 text-sm mt-2 space-y-1">
                        <li>• We'll contact you via WhatsApp after order confirmation</li>
                        <li>• Personalized customer service and support</li>
                        <li>• Answer any final questions you may have</li>
                        <li>• Safe and secure process</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}