"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface BatchDetails {
  id: number;
  batch_id: string;
  title: string;
  state: string;
  manufacturer: string;
  quality: string;
  notes: string;
  manufacture_date: string;
  image_url: string;
  qr_code_url: string;
  product_name: string;
  product_size: string;
  product_description: string;
}

export default function BatchTracePage() {
  const params = useParams();
  const batchId = params.batchId as string;
  const [batch, setBatch] = useState<BatchDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBatchDetails();
  }, [batchId]);

  const fetchBatchDetails = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/batches/${batchId}`);
      if (response.ok) {
        const data = await response.json();
        setBatch(data);
      } else {
        setError("Batch not found");
      }
    } catch (err) {
      setError("Failed to fetch batch details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fff8f2] to-[#ffe8d6] flex items-center justify-center pt-32 pb-16">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#d84727] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error || !batch) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fff8f2] to-[#ffe8d6] flex items-center justify-center pt-32 pb-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#5c3b28] mb-4">Batch Not Found</h1>
          <p className="text-[#5c3b28]/70 mb-6">The batch ID {batchId} could not be found.</p>
          <a href="/" className="bg-[#d84727] text-white px-6 py-3 rounded-lg hover:bg-[#b3361a] transition-colors">
            Return Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff8f2] to-[#ffe8d6] pt-32 pb-16 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating Palm Leaves */}
        <motion.div
          className="absolute top-20 left-5 opacity-5"
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
          className="absolute bottom-40 right-8 opacity-5"
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

        {/* Floating Oil Drops */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-6 h-6 bg-[#d84727] rounded-full opacity-10"
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute bottom-1/3 left-1/4 w-8 h-8 bg-[#2f7a32] rounded-full opacity-10"
          animate={{
            y: [0, 25, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />

        <motion.div
          className="absolute top-2/3 left-1/2 w-5 h-5 bg-[#ffbf00] rounded-full opacity-10"
          animate={{
            y: [0, -20, 0],
            x: [0, 15, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#2f7a32]/10 text-[#2f7a32] rounded-full text-sm font-semibold mb-4">
            <div className="w-2 h-2 bg-[#2f7a32] rounded-full animate-pulse"></div>
            Verified Authentic
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#5c3b28] mb-4">
            {batch.title}
          </h1>
          <p className="text-xl text-[#5c3b28]/70">Batch ID: {batch.batch_id}</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Left Column - Batch Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Batch Image */}
            <motion.div 
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {batch.image_url ? (
                <Image
                  src={batch.image_url}
                  alt={batch.title}
                  width={600}
                  height={400}
                  className="w-full h-64 md:h-80 object-cover"
                />
              ) : (
                <div className="w-full h-64 md:h-80 bg-gradient-to-br from-[#ff6b35] to-[#d84727] flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">PalmPort</span>
                </div>
              )}
            </motion.div>

            {/* Trust Badges */}
            <motion.div 
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-[#2f7a32]/10 rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">🌱</div>
                <div className="text-sm font-semibold text-[#2f7a32]">Sustainable</div>
              </div>
              <div className="bg-[#d84727]/10 rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">🔍</div>
                <div className="text-sm font-semibold text-[#d84727]">Traceable</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Batch Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Product Info Card */}
            <motion.div 
              className="bg-white rounded-2xl shadow-xl p-6"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className="text-xl font-bold text-[#5c3b28] mb-4">Product Information</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-[#ffe8d6]">
                  <span className="text-[#5c3b28]/70">Product:</span>
                  <span className="font-semibold text-[#5c3b28]">{batch.product_name}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#ffe8d6]">
                  <span className="text-[#5c3b28]/70">Size:</span>
                  <span className="font-semibold text-[#5c3b28]">{batch.product_size}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-[#5c3b28]/70">Quality Grade:</span>
                  <span className="font-semibold text-[#2f7a32] bg-[#2f7a32]/10 px-3 py-1 rounded-full">
                    {batch.quality}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Origin Information */}
            <motion.div 
              className="bg-white rounded-2xl shadow-xl p-6"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
            >
              <h3 className="text-xl font-bold text-[#5c3b28] mb-4">Origin & Production</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-[#ffe8d6]">
                  <span className="text-[#5c3b28]/70">Manufacturer:</span>
                  <span className="font-semibold text-[#5c3b28]">{batch.manufacturer}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#ffe8d6]">
                  <span className="text-[#5c3b28]/70">State of Origin:</span>
                  <span className="font-semibold text-[#5c3b28]">{batch.state}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-[#5c3b28]/70">Manufacture Date:</span>
                  <span className="font-semibold text-[#5c3b28]">
                    {new Date(batch.manufacture_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Additional Notes */}
            {batch.notes && (
              <motion.div 
                className="bg-white rounded-2xl shadow-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h3 className="text-xl font-bold text-[#5c3b28] mb-4">Batch Notes</h3>
                <p className="text-[#5c3b28]/70 leading-relaxed">{batch.notes}</p>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <a 
            href="/#shop" 
            className="inline-flex items-center gap-2 bg-[#d84727] text-white px-8 py-4 rounded-2xl font-semibold hover:bg-[#b3361a] transition-colors shadow-lg hover:shadow-xl"
          >
            <span>Shop Authentic Palm Oil</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </motion.div>
      </div>
    </div>
  );
}