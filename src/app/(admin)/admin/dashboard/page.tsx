"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import DashboardStats from "@/components/admin/DashboardStats";

interface DashboardData {
  totalOrders: number;
  pendingOrders: number;
  totalBatches: number;
  totalSubscribers: number;
  recentOrders: any[];
  popularProducts: any[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('palmport-admin-token');
        const response = await fetch('http://localhost:4000/api/admin/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const dashboardData = await response.json();
          setData(dashboardData);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
      {/* Header - REMOVED: No duplicate header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your PalmPort admin panel</p>
      </div>

      {/* Stats */}
      {data && <DashboardStats data={data} />}

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {data?.recentOrders?.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">#{order.order_number}</p>
                  <p className="text-sm text-gray-600">{order.customer_name}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">₦{order.total?.toLocaleString()}</p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    order.delivery_status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.delivery_status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.delivery_status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Add Batch", href: "/admin/batches", color: "bg-[#d84727] hover:bg-[#b3361a]" },
              { label: "View Orders", href: "/admin/orders", color: "bg-[#2f7a32] hover:bg-[#1e4d20]" },
              { label: "Manage Products", href: "/admin/products", color: "bg-[#4A1A03] hover:bg-[#3a1402]" },
              { label: "Email Subscribers", href: "/admin/subscribers", color: "bg-[#ffbf00] hover:bg-[#e6ac00] text-[#4A1A03]" },
            ].map((action, index) => (
              <motion.button
                key={action.label}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = action.href}
                className={`${action.color} text-white py-3 px-4 rounded-xl font-semibold transition-colors duration-200`}
              >
                {action.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}