"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after success
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 5000);
  };

  const contactMethods = [
    {
      icon: "📧",
      title: "Email Us",
      description: "We'll respond within 24 hours",
      value: "hello@palmport.ng",
      link: "mailto:hello@palmport.ng"
    },
    {
      icon: "📞",
      title: "Call Us",
      description: "Mon - Fri, 9am - 5pm WAT",
      value: "+234 901 234 5678",
      link: "tel:+2349012345678"
    },
    {
      icon: "📍",
      title: "Visit Us",
      description: "Come see our operation",
      value: "Lagos, Nigeria",
      link: "https://maps.google.com"
    },
    {
      icon: "💬",
      title: "WhatsApp",
      description: "Quick responses",
      value: "+234 901 234 5678",
      link: "https://wa.me/2349012345678"
    }
  ];

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-white via-[#fff8f2] to-[#ffe8d6] relative overflow-hidden">
      {/* Animated Palm Leaf Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-10 left-5 opacity-5"
          animate={{
            y: [0, -10, 0],
            rotate: [0, 2, 0],
            x: [0, 3, 0],
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
          className="absolute bottom-20 right-8 opacity-5"
          animate={{
            y: [0, 8, 0],
            rotate: [0, -1, 0],
            x: [0, -2, 0],
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
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.span 
            className="inline-block px-4 py-2 bg-[#d84727]/10 text-[#d84727] rounded-full text-sm font-semibold mb-4"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            viewport={{ once: true }}
          >
            💬 Get In Touch
          </motion.span>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#5c3b28] mb-6">
            Let's Start <span className="text-[#d84727]">A Conversation</span>
          </h2>
          <p className="text-xl text-[#5c3b28]/70 max-w-2xl mx-auto">
            Have questions about our palm oil, traceability, or partnerships? We'd love to hear from you and help you discover the authentic taste of Nigeria.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Methods */}
            <div className="grid sm:grid-cols-2 gap-6">
              {contactMethods.map((method, index) => (
                <motion.a
                  key={method.title}
                  href={method.link}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    scale: 1.05,
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="group bg-white rounded-2xl p-6 shadow-lg border border-[#ffe8d6] hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <motion.div
                      className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#d84727] to-[#b3361a] flex items-center justify-center text-white text-lg"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      {method.icon}
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="font-bold text-[#5c3b28] mb-1 group-hover:text-[#d84727] transition-colors">
                        {method.title}
                      </h3>
                      <p className="text-sm text-[#5c3b28]/60 mb-2">
                        {method.description}
                      </p>
                      <p className="text-[#5c3b28] font-semibold text-sm">
                        {method.value}
                      </p>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Farm Image - Replaced Business Hours */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              viewport={{ once: true }}
              className="relative rounded-2xl overflow-hidden shadow-lg"
            >
              <Image
                src="/palmfarm.jpg"
                alt="PalmPort Farm"
                width={400}
                height={250}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#5c3b28]/80 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <strong className="font-bold text-lg mb-2">Sustainable Farm</strong>
                  <p className="text-sm opacity-90">Where quality palm oil begins</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-[#ffe8d6]">
              {/* Success Message */}
              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 p-4 bg-[#2f7a32]/10 border border-[#2f7a32]/20 rounded-xl"
                >
                  <div className="flex items-center gap-3 text-[#2f7a32]">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6 }}
                      className="w-8 h-8 bg-[#2f7a32] rounded-full flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                    <div>
                      <div className="font-semibold">Message Sent Successfully!</div>
                      <div className="text-sm">We'll get back to you within 24 hours.</div>
                    </div>
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    viewport={{ once: true }}
                    className="space-y-2"
                  >
                    <label htmlFor="name" className="block text-sm font-semibold text-[#5c3b28]">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-[#fff8f2] border border-[#ffe8d6] rounded-xl focus:outline-none focus:border-[#d84727] focus:ring-2 focus:ring-[#d84727]/20 transition-all duration-300"
                      placeholder="Your full name"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    viewport={{ once: true }}
                    className="space-y-2"
                  >
                    <label htmlFor="email" className="block text-sm font-semibold text-[#5c3b28]">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-[#fff8f2] border border-[#ffe8d6] rounded-xl focus:outline-none focus:border-[#d84727] focus:ring-2 focus:ring-[#d84727]/20 transition-all duration-300"
                      placeholder="your@email.com"
                    />
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  viewport={{ once: true }}
                  className="space-y-2"
                >
                  <label htmlFor="subject" className="block text-sm font-semibold text-[#5c3b28]">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[#fff8f2] border border-[#ffe8d6] rounded-xl focus:outline-none focus:border-[#d84727] focus:ring-2 focus:ring-[#d84727]/20 transition-all duration-300"
                  >
                    <option value="">Select a topic</option>
                    <option value="wholesale">Wholesale Inquiry</option>
                    <option value="partnership">Partnership</option>
                    <option value="traceability">Traceability Question</option>
                    <option value="support">Customer Support</option>
                    <option value="other">Other</option>
                  </select>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  viewport={{ once: true }}
                  className="space-y-2"
                >
                  <label htmlFor="message" className="block text-sm font-semibold text-[#5c3b28]">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-[#fff8f2] border border-[#ffe8d6] rounded-xl focus:outline-none focus:border-[#d84727] focus:ring-2 focus:ring-[#d84727]/20 transition-all duration-300 resize-none"
                    placeholder="Tell us about your inquiry..."
                  />
                </motion.div>

                {/* Modern Send Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting || isSubmitted}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    scale: isSubmitting || isSubmitted ? 1 : 1.02,
                  }}
                  whileTap={{ scale: isSubmitting || isSubmitted ? 1 : 0.98 }}
                  className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 relative overflow-hidden group ${
                    isSubmitting || isSubmitted
                      ? 'bg-[#2f7a32] text-white cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#d84727] to-[#b3361a] text-white hover:shadow-xl'
                  }`}
                >
                  {/* Button Background Shine */}
                  {!(isSubmitting || isSubmitted) && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    />
                  )}

                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        Sending...
                      </>
                    ) : isSubmitted ? (
                      <>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500 }}
                        >
                          ✓
                        </motion.div>
                        Message Sent!
                      </>
                    ) : (
                      <>
                        <motion.span
                          animate={{ x: [0, 2, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          ✉️
                        </motion.span>
                        Send Message
                        <motion.span
                          animate={{ x: [0, 3, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                          className="opacity-80"
                        >
                          →
                        </motion.span>
                      </>
                    )}
                  </span>

                  {/* Progress Bar for Loading State */}
                  {isSubmitting && (
                    <motion.div
                      className="absolute bottom-0 left-0 h-1 bg-white/30"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2, ease: "easeInOut" }}
                    />
                  )}
                </motion.button>
              </form>
            </div>

            {/* Floating Elements */}
            <motion.div
              className="absolute -top-4 -right-4 w-8 h-8 bg-[#d84727] rounded-full opacity-20"
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
              className="absolute -bottom-6 -left-6 w-12 h-12 bg-[#2f7a32] rounded-full opacity-10"
              animate={{
                y: [0, 20, 0],
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
        </div>
      </div>
    </section>
  );
}