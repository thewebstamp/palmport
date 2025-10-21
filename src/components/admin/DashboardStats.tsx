"use client";
import { motion } from "framer-motion";
import { FiPackage, FiShoppingCart, FiUsers, FiMail } from "react-icons/fi";

interface DashboardStatsProps {
  data: {
    totalOrders: number;
    pendingOrders: number;
    totalBatches: number;
    totalSubscribers: number;
  };
}

const stats = [
  {
    label: "Total Orders",
    value: "totalOrders",
    icon: FiShoppingCart,
    color: "bg-blue-500",
    textColor: "text-blue-600"
  },
  {
    label: "Pending Orders",
    value: "pendingOrders",
    icon: FiPackage,
    color: "bg-yellow-500",
    textColor: "text-yellow-600"
  },
  {
    label: "Total Batches",
    value: "totalBatches",
    icon: FiPackage,
    color: "bg-green-500",
    textColor: "text-green-600"
  },
  {
    label: "Subscribers",
    value: "totalSubscribers",
    icon: FiMail,
    color: "bg-purple-500",
    textColor: "text-purple-600"
  }
];

export default function DashboardStats({ data }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {data[stat.value as keyof typeof data]}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                <Icon className={`text-xl ${stat.textColor}`} />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}