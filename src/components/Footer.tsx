"use client";

import Image from "next/image";
import { Link as ScrollLink } from "react-scroll";
import { motion } from "framer-motion";
import Button from "./Button";
import { useState } from "react";
import { RiFacebookCircleFill, RiInstagramFill, RiWhatsappFill, RiPhoneFill, RiMailFill } from "react-icons/ri";
import Link from "next/link";
import { usePathname } from "next/navigation";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const Footer = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const pathname = usePathname();

  // Check if we're on the home page
  const isHomePage = pathname === "/";

  const handleSubscribe = async () => {
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch(`${apiUrl}/api/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Subscription failed");
      setStatus("success");
      setEmail("");
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  // Smart link component that matches your header logic
  const SmartLink = ({ path, children, className }: { 
    path: string; 
    children: React.ReactNode;
    className?: string;
  }) => {
    if (isHomePage) {
      // On home page, use react-scroll for smooth scrolling
      return (
        <ScrollLink
          to={path}
          smooth={true}
          duration={500}
          spy
          className={className}
          activeClass="active-link"
        >
          {children}
        </ScrollLink>
      );
    } else {
      // On other pages, use next/link to navigate to home page with hash
      return (
        <Link href={`/#${path}`} className={className}>
          {children}
        </Link>
      );
    }
  };

  return (
    <footer className="text-center lg:text-left bg-gradient-to-b from-[#4A1A03] to-[#7B2E10] text-gray-200 pt-16 pb-5 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-16">
          {/* Logo + Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col lg:block items-center"
          >
            {isHomePage ? (
              <ScrollLink to="home" smooth={true} duration={500} spy className="flex items-center gap-3">
                <Image src="/logo.png" alt="PalmPort Logo" width={55} height={55} className="mb-4 drop-shadow-lg w-[38px] lg:w-[45px]" />
                <span className="text-gray-200 font-bold text-lg tracking-wide">Palmport</span>
              </ScrollLink>
            ) : (
              <Link href="/" className="flex items-center gap-3">
                <Image src="/logo.png" alt="PalmPort Logo" width={55} height={55} className="mb-4 drop-shadow-lg w-[38px] lg:w-[45px]" />
                <span className="text-gray-200 font-bold text-lg tracking-wide">Palmport</span>
              </Link>
            )}
            <p className="text-md leading-relaxed">
              Pure, traceable Nigerian palm oil — from farm to kitchen.
              Sustainably produced, trusted, and transparently delivered.
            </p>
          </motion.div>

          {/* Quick Links - FIXED NAVIGATION */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-lg font-bold mb-3 text-[var(--color-palm-red)]">Quick Links</h4>
            <ul className="space-y-2 text-md">
              <li>
                <SmartLink path="home" className="hover:text-[var(--color-palm-green)] transition">
                  Home
                </SmartLink>
              </li>
              <li>
                <SmartLink path="shop" className="hover:text-[var(--color-palm-green)] transition">
                  Shop
                </SmartLink>
              </li>
              <li>
                <SmartLink path="trace" className="hover:text-[var(--color-palm-green)] transition">
                  Trace Batch
                </SmartLink>
              </li>
              <li>
                <SmartLink path="contact" className="hover:text-[var(--color-palm-green)] transition">
                  Contact
                </SmartLink>
              </li>
            </ul>
          </motion.div>

          {/* Contact & Socials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center lg:block"
          >
            <h4 className="text-lg font-bold mb-3 text-[var(--color-palm-red)]">Contact</h4>
            <div className="flex gap-2 items-center text-md mb-1"><RiPhoneFill className="text-md text-[var(--color-palm-red)]" /> <p>+234 812 345 6789</p></div>
            <div className="flex gap-2 items-center text-md mb-4"><RiMailFill className="text-md text-[var(--color-palm-red)]" /> <p>hello@palmport.com</p></div>
            <div className="flex gap-4 text-2xl">
              <a href="#" className="hover:text-[var(--color-palm-green)] transition"><RiFacebookCircleFill /></a>
              <a href="#" className="hover:text-[var(--color-palm-green)] transition"><RiInstagramFill /></a>
              <a href="#" className="hover:text-[var(--color-palm-green)] transition"><RiWhatsappFill /></a>
            </div>
          </motion.div>

          {/* Subscribe */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-lg font-bold mb-3 text-[var(--color-palm-red)]">Stay Updated</h4>
            <p className="text-md mb-3">Subscribe to receive product updates, batch news, and offers.</p>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-[#ffffff1a] text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-palm-green)]"
              />
              <Button
                label={status === "loading" ? "..." : status === "success" ? "Done!" : "Subscribe"}
                variant="primary"
                size="sm"
                shape="pill"
                onClick={handleSubscribe}
              />
            </div>
            {status === "error" && (
              <p className="text-sm text-red-400 mt-2">Something went wrong. Try again.</p>
            )}
            {status === "success" && (
              <p className="text-sm text-green-400 mt-2">Subscribed successfully!</p>
            )}
          </motion.div>
        </div>

        <div className="border-t border-[#ffffff33] mt-12 pt-6 text-center text-sm">
          © {new Date().getFullYear()} PalmPort. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;