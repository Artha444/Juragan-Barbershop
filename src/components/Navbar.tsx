"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { signout } from "@/app/auth/actions";
import type { User } from "@supabase/supabase-js";

interface NavbarProps {
  currentUser: User | null;
  userRole?: string;
}

export default function Navbar({ currentUser, userRole }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Keunggulan", href: "#why-us" },
    { name: "Layanan", href: "#services" },
    { name: "Galeri", href: "#gallery" },
    { name: "Kontak", href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-juragan-darker/90 backdrop-blur-md py-4 shadow-lg" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="#home" className="flex items-center z-50">
          <Image
            src="/logo.jpg"
            alt="Juragan Barbershop Logo"
            width={120}
            height={40}
            className="h-10 md:h-12 w-auto object-contain rounded-lg hover:opacity-90 transition-opacity"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-gray-300 hover:text-juragan-red transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
            {currentUser && userRole === "admin" && (
                <>
                  <li>
                    <Link
                      href="/admin/dashboard"
                      className="text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
                    >
                      <LayoutDashboard size={16} />
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        if (window.confirm('Apakah Anda yakin ingin logout?')) {
                          signout();
                        }
                      }}
                      className="flex items-center gap-2 bg-gray-900 border border-gray-800 hover:bg-juragan-red hover:text-white px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 text-gray-300 cursor-pointer"
                    >
                      <LogOut size={16} />
                      Keluar
                    </button>
                  </li>
                </>
              )}
          </ul>

          {currentUser && userRole !== "admin" && (
                <button
                  onClick={() => {
                    if (window.confirm('Apakah Anda yakin ingin logout?')) {
                      signout();
                    }
                  }}
                  className="flex items-center gap-2 bg-gray-900 border border-gray-800 hover:bg-juragan-red hover:text-white px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 text-gray-300 cursor-pointer"
                >
                  <LogOut size={16} />
                  Keluar
                </button>
              )}
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden z-50 text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-0 left-0 w-full h-screen bg-juragan-darker flex flex-col items-center justify-center gap-8 z-40"
            >
              <ul className="flex flex-col items-center gap-6">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-2xl font-display font-semibold text-white hover:text-juragan-red transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
                {currentUser && userRole === "admin" && (
                  <li>
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-2xl font-display font-semibold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-2 justify-center"
                    >
                      <LayoutDashboard size={20} />
                      Dashboard Admin
                    </Link>
                  </li>
                )}
              </ul>

              {currentUser && (
                <button
                  onClick={() => {
                    if (window.confirm('Apakah Anda yakin ingin logout?')) {
                      setMobileMenuOpen(false);
                      signout();
                    }
                  }}
                  className="flex items-center gap-2 bg-gray-900 border border-gray-800 hover:bg-juragan-red text-white px-8 py-4 rounded-full font-bold text-lg mt-4 cursor-pointer"
                >
                  <LogOut size={20} />
                  Keluar Akun
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
