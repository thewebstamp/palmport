"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { RiArrowRightLine } from "react-icons/ri";

type ButtonProps = {
  label: string;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "premium";
  size?: "sm" | "md" | "lg" | "xl";
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  shape?: "rounded" | "pill" | "sharp";
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  disabled?: boolean;
};

const Button = ({
  label,
  variant = "primary",
  size = "md",
  icon = <RiArrowRightLine className="text-xl" />,
  iconPosition = "right",
  shape = "rounded",
  onClick,
  type = "button",
  className = "",
  disabled = false,
}: ButtonProps) => {
  // 🌟 Ultra-Premium Color Variants
  const variants = {
    primary:
      "bg-gradient-to-r from-[#ffbf00] to-[30%] to-[#ffa000] text-[#4A1A03] shadow-2xl hover:shadow-3xl",
    secondary:
      "bg-gradient-to-r from-[var(--color-earth-brown)] to-[#3a2419] hover:from-[#3a2419] hover:to-[var(--color-earth-brown)] text-white shadow-xl hover:shadow-2xl",
    outline:
      "border-3 border-[var(--color-palm-red)] text-[var(--color-palm-red)] hover:bg-[var(--color-palm-red)] hover:text-white bg-transparent backdrop-blur-sm",
    ghost:
      "text-[var(--color-palm-red)] hover:text-[var(--color-palm-green)] hover:bg-[rgba(47,122,50,0.08)] bg-transparent",
    premium:
      "bg-gradient-to-r from-[var(--color-palm-red)] via-[var(--color-earth-brown)] to-[var(--color-palm-green)] text-white shadow-2xl hover:shadow-3xl relative overflow-hidden"
  };

  // 📏 Enhanced Size Variants
  const sizes = {
    sm: "text-sm px-5 py-2.5",
    md: "text-base px-7 py-3.5",
    lg: "text-lg px-9 py-4",
    xl: "text-xl px-11 py-5"
  };

  // 🔷 Premium Shape Options
  const shapes = {
    rounded: "rounded-xl",
    pill: "rounded-full",
    sharp: "rounded-lg"
  };

  return (
    <motion.button
      whileHover={{ 
        scale: disabled ? 1 : 1.05, 
        y: disabled ? 0 : -2,
        transition: { type: "spring", stiffness: 400, damping: 10 }
      }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        group flex items-center justify-center gap-3 font-bold uppercase tracking-widest
        transition-all duration-500 cursor-pointer select-none relative overflow-hidden
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${variants[variant]} ${sizes[size]} ${shapes[shape]} ${className}
      `}
    >
      {/* Premium Shine Effect */}
      {variant === "premium" && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      )}

      {/* Icon Positioning with Enhanced Animations */}
      {iconPosition === "left" && (
        <motion.span
          className="flex items-center justify-center"
          whileHover={{ x: -3, scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          {icon}
        </motion.span>
      )}
      
      <span className="relative z-10 drop-shadow-sm">{label}</span>
      
      {iconPosition === "right" && (
        <motion.span
          className="flex items-center justify-center"
          whileHover={{ x: 3, scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          {icon}
        </motion.span>
      )}
    </motion.button>
  );
};

export default Button;