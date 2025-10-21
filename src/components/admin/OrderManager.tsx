"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FiSearch, FiFilter, FiEye, FiEdit, FiRefreshCw, FiMessageCircle } from "react-icons/fi";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  email: string;
  phone: string;
  total: number;
  payment_status: string;
  delivery_status: string;
  order_type: string;
  created_at: string;
  items: any[];
}

export default function OrderManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingOrder, setUpdatingOrder] = useState<number | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('palmport-admin-token');
      const response = await fetch(`${apiUrl}/api/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        console.error('Failed to fetch orders:', response.status);
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);

      // Handle unknown error type
      let errorMessage = 'Failed to fetch orders';
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    setUpdatingOrder(orderId);

    try {
      const token = localStorage.getItem('palmport-admin-token');
      console.log('Updating order', orderId, 'to status:', newStatus);

      const response = await fetch(`${apiUrl}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ delivery_status: newStatus })
      });

      console.log('Update response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Update failed:', errorText);
        throw new Error(`Failed to update order: ${errorText}`);
      }

      const updatedOrder = await response.json();
      console.log('Order updated successfully:', updatedOrder);

      // Update the local state
      setOrders(prev => prev.map(order =>
        order.id === orderId ? { ...order, delivery_status: newStatus } : order
      ));

    } catch (error) {
      console.error('Error updating order:', error);

      // Properly handle the unknown error type
      let errorMessage = 'Failed to update order status';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else {
        errorMessage = 'An unknown error occurred';
      }

      alert(`Failed to update order status: ${errorMessage}`);
    } finally {
      setUpdatingOrder(null);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || order.delivery_status === statusFilter;
    const matchesType = typeFilter === "all" || order.order_type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'awaiting_contact': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrderTypeColor = (type: string) => {
    switch (type) {
      case 'online': return 'bg-blue-100 text-blue-800';
      case 'whatsapp': return 'bg-green-100 text-green-800';
      case 'customer_service': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
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
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-[#d84727] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
          <p className="text-gray-600">Manage customer orders and track delivery status</p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2 bg-[#2f7a32] text-white rounded-lg hover:bg-[#1e4d20] transition-colors"
        >
          <FiRefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders by customer, order number, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d84727] focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d84727] focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
          <option value="awaiting_contact">Awaiting Contact</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d84727] focus:border-transparent"
        >
          <option value="all">All Types</option>
          <option value="online">Online</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="customer_service">Customer Service</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order, index) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getOrderTypeIcon(order.order_type)}</span>
                        <div>
                          <div className="text-sm font-medium text-gray-900">#{order.order_number}</div>
                          <div className={`text-xs px-2 py-1 rounded-full ${getOrderTypeColor(order.order_type)}`}>
                            {order.order_type}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.customer_name}</div>
                      <div className="text-sm text-gray-500">{order.phone}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${getOrderTypeColor(order.order_type)}`}>
                        {order.order_type}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₦{order.total?.toLocaleString()}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.delivery_status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        disabled={updatingOrder === order.id}
                        className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(order.delivery_status)} border-none focus:ring-2 focus:ring-[#d84727] disabled:opacity-50`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="awaiting_contact">Awaiting Contact</option>
                      </select>
                      {updatingOrder === order.id && (
                        <div className="mt-1">
                          <div className="w-4 h-4 border-2 border-[#d84727] border-t-transparent rounded-full animate-spin mx-auto" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-[#d84727] hover:text-[#b3361a] mr-3"
                        title="View Details"
                      >
                        <FiEye size={16} />
                      </button>
                      {order.order_type === 'whatsapp' && (
                        <button
                          onClick={() => window.open(`https://wa.me/${order.phone.replace(/^0/, '234')}`, '_blank')}
                          className="text-green-600 hover:text-green-800 mr-3"
                          title="Contact on WhatsApp"
                        >
                          <FiMessageCircle size={16} />
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <FiFilter className="mx-auto text-gray-400 text-4xl mb-4" />
            <p className="text-gray-500">No orders found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{getOrderTypeIcon(selectedOrder.order_type)}</span>
                  <h3 className="text-xl font-bold text-gray-900">
                    Order #{selectedOrder.order_number}
                  </h3>
                </div>
                <p className="text-gray-600">
                  Placed on {new Date(selectedOrder.created_at).toLocaleDateString()} •
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getOrderTypeColor(selectedOrder.order_type)}`}>
                    {selectedOrder.order_type} Order
                  </span>
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Customer Information</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Name:</span> {selectedOrder.customer_name}</p>
                  <p><span className="font-medium">Email:</span> {selectedOrder.email}</p>
                  <p><span className="font-medium">Phone:</span> {selectedOrder.phone}</p>
                  {selectedOrder.order_type === 'whatsapp' && (
                    <button
                      onClick={() => window.open(`https://wa.me/${selectedOrder.phone.replace(/^0/, '234')}`, '_blank')}
                      className="flex items-center gap-2 text-green-600 hover:text-green-800 mt-2"
                    >
                      <FiMessageCircle size={14} />
                      Contact on WhatsApp
                    </button>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Order Status</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Delivery:</span>{' '}
                    <select
                      value={selectedOrder.delivery_status}
                      onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                      className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(selectedOrder.delivery_status)} border-none focus:ring-2 focus:ring-[#d84727]`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="awaiting_contact">Awaiting Contact</option>
                    </select>
                  </p>
                  <p>
                    <span className="font-medium">Payment:</span>{' '}
                    <span className={`px-2 py-1 rounded-full text-xs ${selectedOrder.payment_status === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {selectedOrder.payment_status}
                    </span>
                  </p>
                  <p><span className="font-medium">Total:</span> ₦{selectedOrder.total?.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
              <div className="space-y-3">
                {selectedOrder.items?.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.size} × {item.quantity}</p>
                    </div>
                    <p className="font-semibold">₦{item.total?.toLocaleString()}</p>
                  </div>
                ))}
                <div className="flex justify-between items-center p-3 border-t border-gray-200">
                  <p className="font-semibold">Total</p>
                  <p className="font-semibold text-lg">₦{selectedOrder.total?.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {selectedOrder.order_type === 'whatsapp' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">WhatsApp Order Note</h4>
                <p className="text-yellow-700 text-sm">
                  This order was placed via WhatsApp. Please contact the customer to confirm
                  order details and arrange payment/delivery.
                </p>
                <button
                  onClick={() => window.open(`https://wa.me/${selectedOrder.phone.replace(/^0/, '234')}`, '_blank')}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors mt-3"
                >
                  <FiMessageCircle size={16} />
                  Contact on WhatsApp
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}