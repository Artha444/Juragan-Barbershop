"use client";

import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

interface HeroProps {
  heroData: {
    title: string;
    description: string;
    bg_image: string;
  };
  onBookingClick: () => void;
}

export default function Hero({ heroData, onBookingClick }: HeroProps) {
  return (
    <section id="home" className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroData.bg_image}
          alt="Hero Background"
          className="object-cover w-full h-full"
        />
        {/* Dark Overlay (60% opacity) */}
        <div className="absolute inset-0 bg-black/70 z-10" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-20 flex flex-col items-center text-center mt-16">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="font-display font-black text-5xl md:text-7xl lg:text-8xl text-white mb-6 uppercase tracking-tight max-w-5xl leading-tight"
        >
          {heroData.title.split(" ").map((word, index, arr) => {
            // Stylize some word, e.g. the second-to-last word or "Maksimal"
            const isRed = word.toLowerCase() === "maksimal" || index === Math.floor(arr.length / 2);
            if (isRed) {
              return (
                <span key={index} className="text-transparent bg-clip-text bg-gradient-to-r from-juragan-red to-red-500 mr-2">
                  {word}{" "}
                </span>
              );
            }
            return <span key={index} className="mr-2">{word} </span>;
          })}
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="text-lg md:text-2xl text-gray-300 mb-10 max-w-2xl font-light"
        >
          {heroData.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <button
            onClick={onBookingClick}
            className="group relative flex items-center gap-3 bg-white text-juragan-darker hover:bg-gray-100 px-8 py-4 rounded-full font-bold text-lg md:text-xl transition-all duration-300 hover:scale-105 cursor-pointer shadow-lg shadow-white/10"
          >
            <Calendar className="w-6 h-6 text-juragan-red group-hover:animate-bounce" />
            <span>Pilih Jadwal Pangkas</span>
          </button>
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
