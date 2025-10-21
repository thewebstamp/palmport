"use client";
import { motion } from "framer-motion";
import React, {JSX} from "react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { FiPackage, FiCheckCircle, FiClock, FiTruck, FiShoppingBag, FiFilter } from "react-icons/fi";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  total: number;
  size: string;
}

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  payment_status: string;
  delivery_status: string;
  order_type: string;
  created_at: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('palmport-token');
      const response = await fetch(`${apiUrl}/api/orders/my-orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Group orders by status
  const completedOrders = orders.filter(order => 
    order.delivery_status === 'delivered' || order.delivery_status === 'completed'
  );

  const activeOrders = orders.filter(order => 
    order.delivery_status !== 'delivered' && order.delivery_status !== 'completed'
  );

  const filteredOrders = filter === 'all' 
    ? orders 
    : filter === 'active' 
      ? activeOrders 
      : completedOrders;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
      case 'completed':
        return <FiCheckCircle className="w-5 h-5 text-green-500" />;
      case 'shipped':
      case 'processing':
        return <FiTruck className="w-5 h-5 text-blue-500" />;
      case 'pending':
        return <FiClock className="w-5 h-5 text-yellow-500" />;
      case 'awaiting_contact':
        return <FiClock className="w-5 h-5 text-orange-500" />;
      default:
        return <FiPackage className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'shipped':
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'awaiting_contact':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getOrderTypeIcon = (type: string) => {
    switch (type) {
      case 'online': return '💳';
      case 'whatsapp': return '💬';
      case 'customer_service': return '👨‍💼';
      default: return '📦';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fffaf5] via-[#fff0e8] to-[#ffe8d6] pt-32 pb-16 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-[#d84727] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fffaf5] via-[#fff0e8] to-[#ffe8d6] pt-32 pb-16">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-16 h-16 bg-[#d84727] rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <FiShoppingBag className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#5c3b28] mb-4">
              My Orders
            </h1>
            <p className="text-[#5c3b28]/70 text-lg">
              Track your purchases and order status
            </p>
          </div>

          {/* Order Stats and Filters */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
            <div className="flex flex-wrap gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-[#ffe8d6] min-w-[140px]">
                <div className="text-2xl font-bold text-[#d84727]">{orders.length}</div>
                <div className="text-sm text-[#5c3b28]/70">Total Orders</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-[#ffe8d6] min-w-[140px]">
                <div className="text-2xl font-bold text-blue-600">{activeOrders.length}</div>
                <div className="text-sm text-[#5c3b28]/70">Active</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-[#ffe8d6] min-w-[140px]">
                <div className="text-2xl font-bold text-green-600">{completedOrders.length}</div>
                <div className="text-sm text-[#5c3b28]/70">Completed</div>
              </div>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm border border-[#ffe8d6]">
              <FiFilter className="w-4 h-4 text-[#5c3b28]/70" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'active' | 'completed')}
                className="bg-transparent border-none focus:outline-none focus:ring-0 text-[#5c3b28] font-medium"
              >
                <option value="all">All Orders</option>
                <option value="active">Active Orders</option>
                <option value="completed">Completed Orders</option>
              </select>
            </div>
          </div>

          {orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8 text-center border border-[#ffe8d6]"
            >
              <FiPackage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#5c3b28] mb-2">
                No Orders Yet
              </h3>
              <p className="text-[#5c3b28]/70 mb-6">
                Start shopping to see your orders here
              </p>
              <button
                onClick={() => window.location.href = '/#shop'}
                className="bg-[#d84727] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#b3361a] transition-colors"
              >
                Start Shopping
              </button>
            </motion.div>
          ) : (
            <div className="space-y-8">
              {/* Active Orders Section */}
              {filter !== 'completed' && activeOrders.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-[#5c3b28] mb-4 flex items-center gap-2">
                    <FiClock className="w-5 h-5 text-orange-500" />
                    Active Orders ({activeOrders.length})
                  </h2>
                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-1">
                    {filteredOrders
                      .filter(order => activeOrders.includes(order))
                      .map((order, index) => (
                        <OrderCard 
                          key={order.id} 
                          order={order} 
                          index={index}
                          getStatusIcon={getStatusIcon}
                          getStatusColor={getStatusColor}
                          getOrderTypeIcon={getOrderTypeIcon}
                        />
                      ))}
                  </div>
                </div>
              )}

              {/* Completed Orders Section */}
              {filter !== 'active' && completedOrders.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-[#5c3b28] mb-4 flex items-center gap-2">
                    <FiCheckCircle className="w-5 h-5 text-green-500" />
                    Completed Orders ({completedOrders.length})
                  </h2>
                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-1">
                    {filteredOrders
                      .filter(order => completedOrders.includes(order))
                      .map((order, index) => (
                        <OrderCard 
                          key={order.id} 
                          order={order} 
                          index={index}
                          getStatusIcon={getStatusIcon}
                          getStatusColor={getStatusColor}
                          getOrderTypeIcon={getOrderTypeIcon}
                        />
                      ))}
                  </div>
                </div>
              )}

              {/* No orders for current filter */}
              {filteredOrders.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-lg p-8 text-center border border-[#ffe8d6]"
                >
                  <FiPackage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-[#5c3b28] mb-2">
                    No {filter === 'active' ? 'Active' : filter === 'completed' ? 'Completed' : ''} Orders
                  </h3>
                  <p className="text-[#5c3b28]/70">
                    {filter === 'active' 
                      ? "You don't have any active orders at the moment." 
                      : filter === 'completed'
                      ? "You don't have any completed orders yet."
                      : "No orders match your current filter."}
                  </p>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

// Order Card Component
const OrderCard = ({ 
  order, 
  index, 
  getStatusIcon, 
  getStatusColor, 
  getOrderTypeIcon 
}: { 
  order: Order; 
  index: number;
  getStatusIcon: (status: string) => JSX.Element;
  getStatusColor: (status: string) => string;
  getOrderTypeIcon: (type: string) => string;
}) => (
  <motion.div
    key={order.id}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
    className="bg-white rounded-2xl shadow-lg p-6 border border-[#ffe8d6] hover:shadow-xl transition-all duration-300"
  >
    {/* Order Header */}
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
      <div className="flex items-center gap-4">
        <span className="text-3xl">{getOrderTypeIcon(order.order_type)}</span>
        <div>
          <h3 className="text-xl font-bold text-[#5c3b28]">
            Order #{order.order_number}
          </h3>
          <p className="text-[#5c3b28]/70">
            {new Date(order.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
          <span className="inline-block mt-1 text-sm text-[#5c3b28]/60 capitalize">
            {order.order_type} Order
          </span>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(order.delivery_status)}`}>
          {getStatusIcon(order.delivery_status)}
          <span className="font-semibold capitalize">
            {order.delivery_status.replace('_', ' ')}
          </span>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-[#d84727]">
            ₦{order.total.toLocaleString()}
          </div>
          <div className="text-sm text-[#5c3b28]/70">
            {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
          </div>
        </div>
      </div>
    </div>

    {/* Order Items */}
    <div className="border-t border-[#ffe8d6] pt-6">
      <h4 className="font-semibold text-[#5c3b28] mb-4">Order Items</h4>
      <div className="space-y-3">
        {order.items.map((item, itemIndex) => (
          <div key={itemIndex} className="flex justify-between items-center py-2">
            <div className="flex-1">
              <p className="font-medium text-[#5c3b28]">{item.name}</p>
              <p className="text-sm text-[#5c3b28]/70">
                {item.size} × {item.quantity}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-[#5c3b28]">
                ₦{item.total.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="border-t border-[#ffe8d6] mt-4 pt-4">
        <div className="flex justify-between items-center text-sm">
          <div className="space-y-2">
            <div className="flex gap-4">
              <span className="text-[#5c3b28]/70">Payment Status:</span>
              <span className={`font-medium ${
                order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
              </span>
            </div>
            <div className="flex gap-4">
              <span className="text-[#5c3b28]/70">Shipping:</span>
              <span className="text-[#5c3b28] font-medium">
                ₦{order.shipping.toLocaleString()}
              </span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-[#5c3b28]/70">Subtotal</div>
            <div className="font-semibold text-[#5c3b28]">
              ₦{order.subtotal.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* WhatsApp Order Note */}
    {order.order_type === 'whatsapp' && order.delivery_status === 'awaiting_contact' && (
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="flex items-start gap-3">
          <span className="text-xl">💬</span>
          <div>
            <h5 className="font-semibold text-blue-800 mb-1">
              WhatsApp Order Processing
            </h5>
            <p className="text-blue-700 text-sm">
              Our team will contact you shortly via WhatsApp to confirm your order details 
              and arrange delivery. Please keep your phone nearby.
            </p>
          </div>
        </div>
      </div>
    )}

    {/* Customer Information */}
    <div className="mt-6 p-4 bg-gray-50 rounded-xl">
      <h5 className="font-semibold text-[#5c3b28] mb-2">Delivery Information</h5>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-[#5c3b28]/70">Name:</span>{' '}
          <span className="text-[#5c3b28]">{order.customer_name}</span>
        </div>
        <div>
          <span className="text-[#5c3b28]/70">Phone:</span>{' '}
          <span className="text-[#5c3b28]">{order.phone}</span>
        </div>
        <div className="md:col-span-2">
          <span className="text-[#5c3b28]/70">Address:</span>{' '}
          <span className="text-[#5c3b28]">
            {order.address}, {order.city}, {order.state}
          </span>
        </div>
      </div>
    </div>
  </motion.div>
);