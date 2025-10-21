"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { FiShoppingCart, FiUser } from "react-icons/fi";
import Image from "next/image";

interface CartItem {
  id: number;
  quantity: number;
}

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Get cart count from localStorage instead of API
  useEffect(() => {
    if (!mounted) return;

    const fetchCartCount = () => {
      try {
        const savedCart = localStorage.getItem('palmport-cart');
        if (savedCart) {
          const cartItems: CartItem[] = JSON.parse(savedCart);
          const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
          setCartItemsCount(totalItems);
        } else {
          setCartItemsCount(0);
        }
      } catch (error) {
        console.error('Error reading cart from localStorage:', error);
        setCartItemsCount(0);
      }
    };

    fetchCartCount();

    // Listen for storage changes (if cart is updated in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'palmport-cart') {
        fetchCartCount();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom cart update events
    const handleCartUpdate = () => {
      fetchCartCount();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [mounted]);

  const isActiveLink = (path: string) => {
    if (!mounted) return false;
    return pathname === path;
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "Trace", path: "/tracepage" },
    { name: "Contact", path: "/contact" },
    { name: "Orders", path: "/orders" },
  ];

  return (
    <motion.header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 bg-gradient-to-b from-[#4A1A03]/95 to-[#7B2E10]/95 backdrop-blur-lg shadow-lg py-2"`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      style={{ width: '100vw' }}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-4 py-2">
          {/* LOGO */}
          <Link href="/" className="hidden lg:flex items-center gap-3 group cursor-pointer">
            <LogoContent />
          </Link>

          {/* NAV LINKS - Now visible on mobile too */}
          <nav className="flex flex-wrap justify-center gap-4 md:gap-8">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.path}>
                <span
                  className={`relative font-[Barlow] text-[16px] text-gray-100 md:text-[18px] font-semibold tracking-wide hover:text-[#ffbf00] transition-all duration-300 group block ${
                    isActiveLink(link.path) ? 'text-[#ffbf00]' : 'text-gray-100'
                  }`}
                >
                  {link.name}
                  <motion.span
                    className={`absolute left-0 -bottom-1 h-0.5 transition-all duration-300 ${
                      isActiveLink(link.path) 
                        ? 'w-full bg-[#ffbf00]' 
                        : 'w-0 bg-[#ffbf00] group-hover:w-full'
                    }`}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                </span>
              </Link>
            ))}
          </nav>

          {/* RIGHT ICONS */}
          <div className="flex text-white items-center justify-center gap-5">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/cart"
                className={`relative text-whitehover:text-[#ffbf00] text-xl transition-colors duration-300`}
              >
                <FiShoppingCart />
                {/* Cart Indicator - Always show if there are items */}
                {cartItemsCount > 0 && (
                  <motion.span
                    className="absolute -top-2 -right-2 w-5 h-5 bg-[#ffbf00] text-[#4A1A03] text-xs rounded-full flex items-center justify-center font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {cartItemsCount > 99 ? '99+' : cartItemsCount}
                  </motion.span>
                )}
              </Link>
            </motion.div>

            {/* Only show login icon when user is NOT logged in */}
            {!user && (
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/auth/login"
                  className={`text-white hover:text-[#ffbf00] text-xl transition-colors duration-300`}
                >
                  <FiUser />
                </Link>
              </motion.div>
            )}

            {/* Order Now Button */}
            <Link href="/shop">
              <HeaderButton
                label="Order Now"
                onClick={() => console.log("Order Now clicked")}
              />
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

// Extract logo content to avoid duplication
const LogoContent = () => (
  <>
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <Image
        src="/logo.png"
        alt="PalmPort Logo"
        width={55}
        height={17}
        priority
        className="relative z-50 drop-shadow-lg w-[38px]"
      />
    </motion.div>
      <motion.span
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-white font-bold text-lg tracking-wide hidden lg:block"
      >
        PalmPort
      </motion.span>
  </>
);

// Custom Header Button Component
const HeaderButton = ({
  label,
  onClick,
  fullWidth = false
}: {
  label: string;
  onClick: () => void;
  fullWidth?: boolean;
}) => {
  return (
    <motion.button
      whileHover={{
        scale: 1.05,
        boxShadow: "0 10px 25px -5px rgba(255, 191, 0, 0.4)"
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        bg-gradient-to-r from-[#ffbf00] to-[#ffa000] 
        text-[#4A1A03] font-bold text-sm uppercase 
        tracking-wider px-5 py-2.5 rounded-full
        shadow-lg hover:shadow-xl
        transition-all duration-300
        ${fullWidth ? 'w-full' : ''}
        relative overflow-hidden group
      `}
    >
      {/* Shine Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform"
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />

      <span className="relative z-10 flex items-center gap-2">
        {label}
        <motion.span
          animate={{ x: [0, 3, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          →
        </motion.span>
      </span>
    </motion.button>
  );
};

export default Header;