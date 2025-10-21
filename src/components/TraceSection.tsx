"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function TraceSection() {
  const [batchId, setBatchId] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [particlePositions, setParticlePositions] = useState<Array<{left: string, top: string}>>([]);

  // Generate deterministic particle positions
  useEffect(() => {
    // Use a fixed seed for consistent positions
    const positions = Array.from({ length: 8 }, (_, i) => ({
      left: `${10 + (i * 12)}%`,
      top: `${20 + (i * 8)}%`
    }));
    setParticlePositions(positions);
  }, []);

  const handleTrace = (e: React.FormEvent) => {
    e.preventDefault();
    if (batchId.trim()) {
      window.location.href = `/trace/${batchId.trim()}`;
    }
  };

  return (
    <section id="trace" className="relative py-16 bg-gradient-to-br from-[#fff8f2] via-white to-[#ffe8d6] overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating Oil Drops */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full opacity-10 ${
              i % 3 === 0 ? 'bg-[#d84727]' : i % 3 === 1 ? 'bg-[#2f7a32]' : 'bg-[#ffbf00]'
            }`}
            style={{
              width: `${15 + (i * 4)}px`,
              height: `${15 + (i * 4)}px`,
              left: `${10 + (i * 15)}%`,
              top: `${20 + (i * 10)}%`,
            }}
            animate={{
              y: [0, -25, 0],
              x: [0, Math.sin(i) * 15, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}

        {/* Palm Leaf Shadows */}
        <motion.div
          className="absolute top-10 left-5 opacity-3"
          animate={{
            y: [0, -12, 0],
            rotate: [0, 2, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <PalmLeafSVG />
        </motion.div>

        <motion.div
          className="absolute bottom-20 right-8 opacity-3"
          animate={{
            y: [0, 8, 0],
            rotate: [0, -1, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        >
          <PalmLeafSVG />
        </motion.div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-50px" }}
          className="text-center mb-12"
        >
          <div className="flex gap-2 flex-wrap justify-center">
            <motion.span 
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#7a2f2f]/10 text-[#7a2f2f] rounded-full text-xs font-semibold mb-4 backdrop-blur-sm border border-[#7a2f2f]/20"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <div className="w-1.5 h-1.5 bg-[#7a2f2f] rounded-full animate-pulse" />
            Unadulterated
          </motion.span>
          <motion.span 
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#7a2f2f]/10 text-[#7a2f2f] rounded-full text-xs font-semibold mb-4 backdrop-blur-sm border border-[#7a2f2f]/20"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <div className="w-1.5 h-1.5 bg-[#7a2f2f] rounded-full animate-pulse" />
            Traceable
          </motion.span>
          <motion.span 
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#7a2f2f]/10 text-[#7a2f2f] rounded-full text-xs font-semibold mb-4 backdrop-blur-sm border border-[#7a2f2f]/20"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <div className="w-1.5 h-1.5 bg-[#7a2f2f] rounded-full animate-pulse" />
            Trusted
          </motion.span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-[#5c3b28] mb-4 leading-tight">
            Trace Your Oil's&nbsp;
            <motion.span 
              className="bg-gradient-to-r from-[#d84727] to-[#2f7a32] bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              Journey
            </motion.span>
          </h2>
          <motion.p 
            className="text-xl text-[#5c3b28]/70 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            Discover the origin, quality, and sustainable journey of your palm oil 
            with our verified traceability system.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-6xl mx-auto">
          {/* Left Side - Interactive Trace Input */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, margin: "-50px" }}
            className="relative"
          >
            {/* Main Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20 relative overflow-hidden">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#d84727]/5 to-[#2f7a32]/5 rounded-2xl" />
              
              {/* QR Scan Option */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true, margin: "-50px" }}
                className="text-center mb-6 relative z-10"
              >
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#2f7a32]/10 to-[#d84727]/10 rounded-xl backdrop-blur-sm border border-white/20">
                  <motion.div 
                    className="w-10 h-10 bg-gradient-to-br from-[#2f7a32] to-[#d84727] rounded-xl flex items-center justify-center shadow-md"
                    whileHover={{ scale: 1.05, rotate: 3 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                  </motion.div>
                  <div>
                    <div className="font-semibold text-[#5c3b28] text-sm">Scan QR Code</div>
                    <div className="text-xs text-[#5c3b28]/60">Located on your bottle</div>
                  </div>
                </div>
              </motion.div>

              {/* Or Divider */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true, margin: "-50px" }}
                className="relative flex items-center justify-center mb-6"
              >
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#ffe8d6]"></div>
                </div>
                <div className="relative bg-white/80 px-3 text-xs text-[#5c3b28]/50 backdrop-blur-sm">or enter manually</div>
              </motion.div>

              {/* Batch ID Input */}
              <form onSubmit={handleTrace} className="space-y-4 relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  viewport={{ once: true, margin: "-50px" }}
                  className="relative"
                >
                  <label htmlFor="batchId" className="block text-xs font-semibold text-[#5c3b28] mb-2 uppercase tracking-wide">
                    Enter Batch ID
                  </label>
                  <div className={`relative transition-all duration-300 ${isFocused ? 'scale-[1.02]' : 'scale-100'}`}>
                    <motion.input
                      type="text"
                      id="batchId"
                      value={batchId}
                      onChange={(e) => setBatchId(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      placeholder="e.g., PALM-2501-LG"
                      className="w-full px-4 py-3 text-base bg-white/50 border border-[#ffe8d6] rounded-xl focus:outline-none focus:border-[#d84727] focus:ring-2 focus:ring-[#d84727]/20 transition-all duration-200 backdrop-blur-sm placeholder-[#5c3b28]/30"
                      whileFocus={{ scale: 1.01 }}
                    />
                    {isFocused && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#d84727]/5 to-[#2f7a32]/5 -z-10"
                      />
                    )}
                  </div>
                </motion.div>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  viewport={{ once: true, margin: "-50px" }}
                >
                  <motion.button
                    type="submit"
                    disabled={!batchId.trim()}
                    whileHover={{ 
                      scale: batchId.trim() ? 1.02 : 1,
                    }}
                    whileTap={{ scale: batchId.trim() ? 0.98 : 1 }}
                    className={`w-full py-3 px-6 rounded-xl font-semibold text-base transition-all duration-200 relative overflow-hidden ${
                      batchId.trim() 
                        ? 'bg-gradient-to-r from-[#d84727] to-[#b3361a] text-white shadow-lg hover:shadow-xl' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <motion.span
                        animate={{ x: [0, 3, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        🔍
                      </motion.span>
                      Trace Authenticity
                    </span>
                    
                    {/* Button Shine Effect */}
                    {batchId.trim() && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                      />
                    )}
                  </motion.button>
                </motion.div>
              </form>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                viewport={{ once: true, margin: "-50px" }}
                className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-[#ffe8d6]"
              >
                {[
                  { icon: "🔒", text: "Secure" },
                  { icon: "🌱", text: "Verified" },
                  { icon: "⚡", text: "Instant" }
                ].map((item, index) => (
                  <motion.div
                    key={item.text}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    className="text-center p-2 rounded-lg bg-white/50 backdrop-blur-sm border border-white/20"
                  >
                    <div className="text-lg mb-1">{item.icon}</div>
                    <div className="text-xs font-medium text-[#5c3b28]">{item.text}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Floating Elements */}
            <motion.div
              className="absolute -top-3 -left-3 w-6 h-6 bg-[#d84727] rounded-full opacity-20"
              animate={{
                y: [0, -15, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute -bottom-4 -right-4 w-8 h-8 bg-[#2f7a32] rounded-full opacity-10"
              animate={{
                y: [0, 12, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            />
          </motion.div>

          {/* Right Side - Visual Demo */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, margin: "-50px" }}
            className="relative"
          >
            {/* Main Demo Card */}
            <div className="relative bg-gradient-to-br from-[#5c3b28] via-[#2f7a32] to-[#d84727] rounded-2xl p-6 shadow-xl overflow-hidden">
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-8 left-8 w-16 h-24">
                  <PalmLeafSVG />
                </div>
                <div className="absolute bottom-8 right-8 w-20 h-28">
                  <PalmLeafSVG />
                </div>
              </div>

              {/* Floating Particles - FIXED: Use deterministic positions */}
              {particlePositions.map((position, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 bg-white rounded-full opacity-20"
                  style={{
                    left: position.left,
                    top: position.top,
                  }}
                  animate={{
                    y: [0, -15, 0],
                    opacity: [0.2, 0.6, 0.2],
                  }}
                  transition={{
                    duration: 3 + (i * 0.5),
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.3,
                  }}
                />
              ))}

              {/* Demo Content */}
              <div className="relative z-10 text-white">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  viewport={{ once: true, margin: "-50px" }}
                  className="text-center mb-6"
                >
                  <h3 className="text-xl font-bold mb-3">Digital Product Passport</h3>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30">
                    <motion.div 
                      className="w-2 h-2 bg-green-400 rounded-full"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="font-semibold text-sm">Verified Authentic</span>
                  </div>
                </motion.div>

                {/* Batch Info Grid */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  viewport={{ once: true, margin: "-50px" }}
                  className="grid grid-cols-2 gap-3 mb-6"
                >
                  {[
                    { label: "Batch ID", value: "PALM-2501-LG", icon: "🆔" },
                    { label: "Origin", value: "Lagos, Nigeria", icon: "🌍" },
                    { label: "Quality", value: "Grade A", icon: "⭐" },
                    { label: "Producer", value: "Adeola Co-op", icon: "👨‍🌾" }
                  ].map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      viewport={{ once: true, margin: "-50px" }}
                      className="bg-white/10 rounded-lg p-3 backdrop-blur-sm border border-white/20"
                      whileHover={{ scale: 1.02, y: -1 }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">{item.icon}</span>
                        <div className="text-xs opacity-80">{item.label}</div>
                      </div>
                      <div className="font-semibold text-sm">{item.value}</div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Sustainability Timeline */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  viewport={{ once: true, margin: "-50px" }}
                  className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#2f7a32] to-[#d84727] rounded-xl flex items-center justify-center">
                      <span className="text-lg">🌱</span>
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Sustainable Journey</div>
                      <div className="text-xs opacity-80">From farm to bottle</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs">
                    {['Harvest', 'Process', 'Quality', 'Bottle'].map((step, i) => (
                      <motion.div
                        key={step}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.8 + i * 0.1 }}
                        viewport={{ once: true, margin: "-50px" }}
                        className="text-center"
                      >
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mb-1" />
                        <div className="text-xs">{step}</div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Animated Scan Lines */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-transparent via-white/3 to-transparent"
                animate={{
                  y: [-100, 300],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 1
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Palm Leaf SVG Component
function PalmLeafSVG() {
  return (
    <svg viewBox="0 0 100 150" className="text-current w-full h-full">
      <path
        d="M50,10 C60,5 75,15 70,30 C65,45 80,60 65,75 C50,90 55,110 40,120 C25,130 30,145 20,140 C10,135 15,115 25,100 C35,85 20,70 35,55 C50,40 40,15 50,10 Z"
        fill="currentColor"
      />
    </svg>
  );
}