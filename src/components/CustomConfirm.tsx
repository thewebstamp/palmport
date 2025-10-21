"use client";
import { motion, AnimatePresence } from "framer-motion";
import { FiAlertCircle, FiCheck, FiX } from "react-icons/fi";

interface CustomConfirmProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'info' | 'danger';
}

export default function CustomConfirm({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText = "Yes",
  cancelText = "Cancel",
  type = 'warning'
}: CustomConfirmProps) {

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <FiAlertCircle className="w-6 h-6 text-yellow-500" />;
      case 'danger':
        return <FiAlertCircle className="w-6 h-6 text-red-500" />;
      default:
        return <FiAlertCircle className="w-6 h-6 text-blue-500" />;
    }
  };

  const getConfirmButtonStyle = () => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-500 hover:bg-yellow-600 text-white';
      case 'danger':
        return 'bg-red-500 hover:bg-red-600 text-white';
      default:
        return 'bg-blue-500 hover:bg-blue-600 text-white';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-[#ffe8d6]"
          >
            <div className="flex items-start gap-4 mb-4">
              {getIcon()}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[#5c3b28] mb-2">{title}</h3>
                <p className="text-[#5c3b28]/70">{message}</p>
              </div>
              <button
                onClick={onCancel}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-[#5c3b28] border border-[#ffe8d6] rounded-lg hover:bg-[#fff8f2] transition-colors font-medium"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className={`px-4 py-2 rounded-lg transition-colors font-medium ${getConfirmButtonStyle()}`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}