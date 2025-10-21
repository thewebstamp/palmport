"use client";
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAlert } from '@/contexts/AlertContext';
import { Suspense } from 'react'
import { motion } from 'framer-motion';

// Wrap the main component with Suspense
export default function PaymentSuccess() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentSuccessContent />
    </Suspense>
  )
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fffaf5] via-[#fff0e8] to-[#ffe8d6] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md w-full border border-[#ffe8d6]">
        <div className="w-16 h-16 border-4 border-[#d84727] border-t-transparent rounded-full mx-auto mb-4 animate-spin" />
        <h2 className="text-2xl font-bold text-[#5c3b28] mb-2">Loading...</h2>
        <p className="text-[#5c3b28]/70">Please wait while we load your payment details</p>
      </div>
    </div>
  )
}

// Main component that uses useSearchParams
function PaymentSuccessContent() {
  const [status, setStatus] = useState('processing');
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showAlert } = useAlert();

  useEffect(() => {
    const reference = searchParams.get('reference');

    console.log('💰 Payment success for reference:', reference);

    // Simulate payment verification process
    setTimeout(() => {
      setStatus('success');
      showAlert({
        title: 'Payment Successful! 🎉',
        message: 'Your order has been confirmed and payment processed successfully.',
        type: 'success',
        duration: 5000
      });

      // Clear cart
      localStorage.removeItem('palmport-cart');

      // Redirect to orders page after success
      setTimeout(() => {
        router.push('/orders');
      }, 3000);
    }, 2000);
  }, [searchParams, router, showAlert]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fffaf5] via-[#fff0e8] to-[#ffe8d6] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md w-full border border-[#ffe8d6]"
      >
        {status === 'processing' && (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-[#d84727] border-t-transparent rounded-full mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold text-[#5c3b28] mb-2">Processing Payment</h2>
            <p className="text-[#5c3b28]/70">Please wait while we confirm your payment...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <span className="text-2xl text-white">✓</span>
            </motion.div>
            <h2 className="text-2xl font-bold text-[#5c3b28] mb-2">Payment Successful! 🎉</h2>
            <p className="text-[#5c3b28]/70 mb-4">
              Order: {searchParams.get('reference')}
            </p>
            <p className="text-[#5c3b28]/70">Redirecting to your orders...</p>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 3, ease: "linear" }}
              className="h-2 bg-green-500 rounded-full mt-4"
            />
          </>
        )}
      </motion.div>
    </div>
  );
}