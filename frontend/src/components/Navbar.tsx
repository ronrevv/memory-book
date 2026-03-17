"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/create", label: "Create" },
  { href: "/explore", label: "Explore" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20"
    >
      <div className="section-padding">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                <path d="M12 6l-2 4h4l-2 4" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">
              Memory<span className="text-gradient">Book</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-100/60 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/auth/login"
              className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Log in
            </Link>
            <Link href="/auth/register" className="btn-primary !px-6 !py-2.5 !text-sm">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-gray-100/60 transition-colors"
            aria-label="Toggle menu"
          >
            <div className="w-5 h-5 flex flex-col justify-center gap-1.5">
              <span className={`block h-0.5 w-5 bg-gray-800 transition-all ${isOpen ? "rotate-45 translate-y-1" : ""}`} />
              <span className={`block h-0.5 bg-gray-800 transition-all ${isOpen ? "opacity-0 w-0" : "w-4"}`} />
              <span className={`block h-0.5 w-5 bg-gray-800 transition-all ${isOpen ? "-rotate-45 -translate-y-1" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/20"
          >
            <div className="p-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 rounded-xl hover:bg-gray-100/60 transition-all"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-gray-200/50 flex flex-col gap-2">
                <Link href="/auth/login" className="btn-secondary text-center !py-3">
                  Log in
                </Link>
                <Link href="/auth/register" className="btn-primary text-center !py-3">
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
