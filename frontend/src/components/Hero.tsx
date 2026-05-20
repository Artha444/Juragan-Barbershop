"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar } from "lucide-react";

export default function Hero() {
  return (
    <section id="home" className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="object-cover w-full h-full"
          poster="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
        >
          {/* Using a placeholder stock video */}
          <source
            src="https://cdn.pixabay.com/video/2019/11/02/28574-370566367_large.mp4"
            type="video/mp4"
          />
        </video>
        {/* Dark Overlay (50% opacity) */}
        <div className="absolute inset-0 bg-black/60 z-10" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-20 flex flex-col items-center text-center mt-16">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="font-display font-black text-5xl md:text-7xl lg:text-8xl text-white mb-6 uppercase tracking-tight max-w-5xl leading-tight"
        >
          Tampil <span className="text-transparent bg-clip-text bg-gradient-to-r from-juragan-red to-red-500">Maksimal</span> dan Berkelas
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="text-lg md:text-2xl text-gray-300 mb-10 max-w-2xl font-light"
        >
          Layanan pangkas rambut dan perawatan pria premium dengan kapster berpengalaman.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link
            href="#booking"
            className="group relative flex items-center gap-3 bg-white text-juragan-darker hover:bg-gray-100 px-8 py-4 rounded-full font-bold text-lg md:text-xl transition-all duration-300 hover:scale-105"
          >
            <Calendar className="w-6 h-6 text-juragan-red group-hover:animate-bounce" />
            <span>Pilih Jadwal Pangkas</span>
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Scroll</span>
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-1 h-12 bg-gradient-to-b from-juragan-red to-transparent rounded-full"
        />
      </motion.div>
    </section>
  );
}
