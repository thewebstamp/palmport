"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FiPackage, FiTruck, FiCheckCircle, FiClock, FiFilter, FiMessageCircle } from "react-icons/fi";

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

interface OrderHistoryProps {
  userId: number;
}

export default function OrderHistory({ userId }: OrderHistoryProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'processing' | 'completed' | 'cancelled' | 'awaiting_contact'>('all');

  useEffect(() => {
    fetchOrders();
  }, [userId]);

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

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.delivery_status === filter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'delivered':
        return <FiCheckCircle className="w-4 h-4 text-green-500" />;
      case 'processing':
      case 'shipped':
        return <FiTruck className="w-4 h-4 text-blue-500" />;
      case 'pending':
        return <FiClock className="w-4 h-4 text-yellow-500" />;
      case 'awaiting_contact':
        return <FiMessageCircle className="w-4 h-4 text-orange-500" />;
      default:
        return <FiPackage className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'processing':
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'awaiting_contact':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-6 h-6 border-2 border-[#d84727] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-[#5c3b28]">Order History</h3>
          <p className="text-[#5c3b28]/70 text-sm">Track your purchases and order status</p>
        </div>
        
        {/* Filter */}
        <div className="flex items-center gap-2">
          <FiFilter className="w-4 h-4 text-[#5c3b28]/70" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-1 border border-[#ffe8d6] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#d84727] focus:border-transparent"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="awaiting_contact">Awaiting Contact</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 bg-white rounded-2xl border border-[#ffe8d6]"
        >
          <FiPackage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-[#5c3b28] mb-2">No Orders Found</h4>
          <p className="text-[#5c3b28]/70 text-sm">
            {filter === 'all' 
              ? "You haven't placed any orders yet." 
              : `No ${filter} orders found.`}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl border border-[#ffe8d6] p-6 hover:shadow-lg transition-all duration-300"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getOrderTypeIcon(order.order_type)}</span>
                  <div>
                    <h4 className="font-semibold text-[#5c3b28]">Order #{order.order_number}</h4>
                    <p className="text-[#5c3b28]/70 text-sm">
                      {formatDate(order.created_at)} • 
                      <span className="ml-1 capitalize">{order.order_type} Order</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.delivery_status)}`}>
                    {getStatusIcon(order.delivery_status)}
                    {order.delivery_status.charAt(0).toUpperCase() + order.delivery_status.slice(1).replace('_', ' ')}
                  </span>
                  <span className="text-lg font-bold text-[#d84727]">
                    ₦{order.total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t border-[#ffe8d6] pt-4">
                <div className="space-y-2">
                  {order.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-[#5c3b28] font-medium">{item.name}</span>
                        <span className="text-[#5c3b28]/70">{item.size} × {item.quantity}</span>
                      </div>
                      <span className="text-[#5c3b28] font-medium">₦{item.total.toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#ffe8d6] text-sm">
                  <div className="space-y-1">
                    <div className="flex gap-4">
                      <span className="text-[#5c3b28]/70">Payment:</span>
                      <span className={`font-medium ${
                        order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                      </span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-[#5c3b28]/70">Shipping:</span>
                      <span className="text-[#5c3b28]">₦{order.shipping.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[#5c3b28]/70 text-xs">Total Items</div>
                    <div className="font-semibold text-[#5c3b28]">
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                    </div>
                  </div>
                </div>
              </div>

              {/* WhatsApp Order Note */}
              {order.order_type === 'whatsapp' && order.delivery_status === 'awaiting_contact' && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-700">
                    <FiMessageCircle className="w-4 h-4" />
                    <p className="text-sm">
                      <strong>WhatsApp Order:</strong> Our team will contact you shortly to confirm your order details and arrange delivery.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}