"use client";

import Link from "next/link";
import { Scissors } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black py-12 border-t border-gray-900">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Scissors className="w-8 h-8 text-juragan-red" />
            <span className="font-display font-bold text-2xl tracking-wider text-white">
              JURAGAN
            </span>
          </div>
          
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="#" className="hover:text-juragan-red transition-colors">
              Kebijakan Privasi
            </Link>
            <Link href="#" className="hover:text-juragan-red transition-colors">
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
        
        <div className="mt-8 text-center text-gray-600 text-sm">
          &copy; {currentYear} Juragan Barbershop. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
