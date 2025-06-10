"use client"; // required for client-side functionality like  onClick

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Footer() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <footer className="bg-[#1C2526]/90 backdrop-blur-sm text-white py-12">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {/* Company Info */}
        <motion.div variants={itemVariants}>
          <div className="text-3xl font-bold mb-4 tracking-tight">Evodynamix</div>
          <p className="mb-4 text-gray-300 text-sm leading-relaxed">
            When you choose Evodynamix Solutions, you choose a partner dedicated to your success. We don’t just develop software, we craft solutions that fuel progress, foster innovation, and unlock limitless possibilities.
          </p>
          <p className="flex items-center mb-2 text-gray-300 text-sm">
            <span className="mr-2">📍</span> Dhaka, Bangladesh
          </p>
          <p className="flex items-center mb-2 text-gray-300 text-sm">
            <span className="mr-2">📞</span> +8801787395758
          </p>
          <p className="flex items-center text-gray-300 text-sm">
            <span className="mr-2">✉️</span> contact@evodynamix.onmicrosoft.com
          </p>
        </motion.div>

        {/* Company Links */}
        <motion.div variants={itemVariants}>
          <h3 className="text-xl font-bold mb-4 text-[#00C4B4]">Company</h3>
          <ul className="space-y-3">
            {["About Us", "Policy", "Terms and Conditions", "Career", "Blog", "Contact Us"].map((link, index) => (
              <li key={index}>
                <a
                  href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-gray-300 hover:text-[#00C4B4] transition duration-300 text-sm"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* ProductLinks */}
        <motion.div variants={itemVariants}>
          <h3 className="text-xl font-bold mb-4 text-[#00C4B4]">Products</h3>
          <ul className="space-y-3">
            {["Template Clouds", "CRM Integration", "HRM Integration", "ERP System"].map((product, index) => (
              <li key={index}>
                <a
                  href="#"
                  className="text-gray-300 hover:text-[#00C4B4] transition duration-300 text-sm"
                >
                  {product}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.div>

      {/* BottomSection*/}
      <motion.div
        variants={itemVariants}
        className="container mx-auto px-4 mt-10 flex flex-col md:flex-row justify-between items-center border-t border-gray-700 pt-6"
      >
        <p className="text-gray-400 text-sm mb-4 md:mb-0">
          © 2025 Evodynamix. All Rights Reserved.
        </p>
        <div className="flex space-x-4 items-center">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <motion.div whileHover={{ scale: 1.2, rotate: 10 }} transition={{ duration: 0.3 }}>
              <Image src="/images/instagram.svg" alt="Instagram" width={24} height={24} className="text-gray-400 hover:text-[#00C4B4] transition duration-300" />
            </motion.div>
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <motion.div whileHover={{ scale: 1.2, rotate: 10 }} transition={{ duration: 0.3 }}>
              <Image src="/images/facebook.svg" alt="Facebook" width={24} height={24} className="text-gray-400 hover:text-[#00C4B4] transition duration-300" />
            </motion.div>
          </a>
          <a href="https://linkedin.com/company/evodynamix" target="_blank" rel="noopener noreferrer">
            <motion.div whileHover={{ scale: 1.2, rotate: 10 }} transition={{ duration: 0.3 }}>
              <Image src="/images/linkedin.svg" alt="LinkedIn" width={24} height={24} className="text-gray-400 hover:text-[#00C4B4] transition duration-300" />
            </motion.div>
          </a>
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-[#00C4B4] text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#00A399] transition duration-300"
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            ↑
          </motion.button>
        </div>
      </motion.div>
    </footer>
  );
}