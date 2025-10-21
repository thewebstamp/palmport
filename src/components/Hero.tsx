"use client";
import { motion } from "framer-motion";
import { Link as ScrollLink } from "react-scroll";
import Image from "next/image";

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#fffaf5] via-[#fff0e8] to-[#ffe8d6]">
      {/* Enhanced Animated Background Elements */}

      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute ${i % 4 === 0 ? "top-1/4" : i % 4 === 1 ? "bottom-1/3" : i % 4 === 2 ? "top-3/4" : "bottom-1/4"
              } ${i % 3 === 0 ? "left-1/6" : i % 3 === 1 ? "right-1/4" : "left-3/4"
              } w-4 h-4 rounded-full`}
            style={{
              background: i % 3 === 0 ? '#d84727' : i % 3 === 1 ? '#2f7a32' : '#5c3b28',
              opacity: 0.1
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 15, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02] bg-gradient-to-r from-[#d84727] via-transparent to-[#2f7a32]" />

      {/* Animated Palm Leaves */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute ${i === 0 ? "top-20 left-5" : i === 1 ? "bottom-40 right-8" : "top-40 right-20"
            } w-40 h-60 opacity-5`}
          initial={{ rotate: i === 0 ? -15 : i === 1 ? 10 : -5, scale: 0.8 }}
          animate={{
            rotate: i === 0 ? [-15, -20, -15] : i === 1 ? [10, 15, 10] : [-5, -10, -5],
            scale: [0.8, 0.85, 0.8],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Image
            src="/palmleaf.png"
            alt="Palm Leaf"
            fill
            className="object-contain"
            priority
          />
        </motion.div>
      ))}

      {/* Main Content - Fixed Padding for Header */}
      <div className="relative z-10 container mx-auto px-4 sm:px-10 flex items-center justify-center min-h-screen pt-27 md:pt-20 pb-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-center w-full max-w-7xl">

          {/* Text Section - Centered on Mobile */}
          <div className="text-center lg:text-left space-y-6">

            {/* Modern Badge */}
            <div className="flex gap-2 flex-wrap mt-7 sm:mt-0  justify-center lg:justify-start">
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-3 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full shadow-sm border border-white/40"
              >
                <div className="flex gap-1">
                  {[...Array(1)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 bg-red-700 rounded-full"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
                <span className="text-xs font-medium text-[#5c3b28] uppercase tracking-widest">
                  Unadulterated
                </span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-3 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full shadow-sm border border-white/40"
              >
                <div className="flex gap-1">
                  {[...Array(1)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 bg-red-700 rounded-full"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
                <span className="text-xs font-medium text-[#5c3b28] uppercase tracking-widest">
                  Traceable
                </span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-3 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full shadow-sm border border-white/40"
              >
                <div className="flex gap-1">
                  {[...Array(1)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 bg-red-700 rounded-full"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
                <span className="text-xs font-medium text-[#5c3b28] uppercase tracking-widest">
                  Trusted
                </span>
              </motion.div>
            </div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-4"
            >
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
                <span className="text-[#5c3b28]">Pure </span>
                <span className="text-[#d84727]">Nigerian </span>
                <span className="text-[#2f7a32]">Palm Oil</span>
              </h1>

              <p className="text-base sm:text-lg text-[#5c3b28]/80 leading-relaxed max-w-md mx-auto lg:mx-0 px-2 sm:px-0">
                Harvested from Nigeria's richest soil,{" "}
                <span className="font-semibold text-[#d84727]">traceably sourced</span>{" "}
                and delivered with ancestral care.
              </p>
            </motion.div>

            {/* Modern Button Group - Fixed for Mobile */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 justify-center items-center sm:items-start lg:justify-start px-2 sm:px-0"
            >
              <ScrollLink
                to="shop"
                smooth={true}
                duration={500}
                spy
                className="cursor-pointer w-full sm:w-[fit-content]"
              >
                <ModernButton
                  label="Shop Premium Oil"
                  variant="primary"
                  onClick={() => console.log("Shop clicked")}
                />
              </ScrollLink>
              <ScrollLink
                to="trace"
                smooth={true}
                duration={500}
                spy
                className="cursor-pointer w-full sm:w-[fit-content]"
              >
                <ModernButton
                  label="Trace Authenticity"
                  variant="outline"
                  onClick={() => console.log("Trace clicked")}
                />
              </ScrollLink>
            </motion.div>

            {/* Minimal Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-[#ffe8d6]/50 px-2 sm:px-0"
            >
              {[
                { number: "500+", label: "Families", color: "text-[#d84727]" },
                { number: "98.7%", label: "Purity", color: "text-[#2f7a32]" },
                { number: "50+", label: "Farmers", color: "text-[#5c3b28]" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                  className="text-center"
                >
                  <div className={`text-xl sm:text-2xl font-bold ${stat.color} mb-1`}>
                    {stat.number}
                  </div>
                  <div className="text-xs text-[#5c3b28]/60 font-medium uppercase tracking-wider">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Enhanced Image Showcase */}
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            className="relative flex justify-center items-center mt-8 lg:mt-0"
          >

            {/* Background Glow */}
            <motion.div
              className="absolute w-64 sm:w-80 lg:w-96 h-64 sm:h-80 lg:h-96 rounded-full bg-gradient-to-br from-[#ff6b35]/10 to-[#2f7a32]/10 blur-2xl lg:blur-3xl"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Main Image Container */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="relative z-10"
            >

              {/* Glass Morphism Container */}
              <div className="bg-white/20 backdrop-blur-lg rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-xl lg:shadow-2xl border border-white/30 mx-2 sm:mx-0">
                <div className="bg-gradient-to-br from-[#d84727]/5 to-[#2f7a32]/5 rounded-xl lg:rounded-2xl p-4 lg:p-6">

                  {/* Palm Oil Image */}
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0, rotate: -2 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="relative w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 mx-auto"
                  >
                    <Image
                      src="/palmoil.png"
                      alt="Premium Nigerian Palm Oil"
                      fill
                      className="object-contain drop-shadow-lg lg:drop-shadow-2xl"
                      priority
                    />
                  </motion.div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                className="absolute -top-2 -right-2 bg-white/90 backdrop-blur-md p-2 rounded-lg shadow-md border border-white/40"
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: 0.9, type: "spring" }}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <div className="w-5 h-5 bg-gradient-to-br from-[#2f7a32] to-[#5c3b28] rounded flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </motion.div>

              <motion.div
                className="absolute -bottom-2 -left-2 bg-white/90 backdrop-blur-md px-2 py-1.5 rounded-lg shadow-md border border-white/40"
                initial={{ scale: 0, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.1, type: "spring" }}
              >
                <p className="text-xs text-[#5c3b28] font-medium">Certified</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Modern Scroll Indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          className="flex flex-col items-center gap-1"
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-xs text-[#5c3b28]/50 font-medium">Scroll</span>
          <motion.div
            className="w-4 h-5 border border-[#5c3b28]/20 rounded-full flex justify-center"
            animate={{ y: [0, 3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <motion.div
              className="w-0.5 h-1.5 bg-[#5c3b28]/40 rounded-full mt-1"
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

// Ultra-Modern Button Component - Fixed for Mobile
const ModernButton = ({
  label,
  variant = "primary",
  onClick
}: {
  label: string;
  variant?: "primary" | "outline";
  onClick?: () => void;
}) => {
  const baseStyles = "px-10 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 flex-1 sm:flex-none";

  const variants = {
    primary: "bg-[#d84727] text-white shadow-lg hover:shadow-xl hover:bg-[#b3361a] transform hover:-translate-y-0.5",
    outline: "border border-[#5c3b28] text-[#5c3b28] hover:bg-[#5c3b28] hover:text-white transform hover:-translate-y-0.5"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} w-full sm:w-[fit-content]`}
    >
      <span className="truncate">{label}</span>
      <motion.span
        animate={{ x: [0, 3, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        →
      </motion.span>
    </motion.button>
  );
};