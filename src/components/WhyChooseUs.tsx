"use client";

import { motion } from "framer-motion";
import { Scissors, Wind, Award, MessageCircle } from "lucide-react";

const features = [
  {
    icon: <Scissors className="w-10 h-10 text-juragan-red" />,
    title: "Kapster Profesional",
    description: "Berpengalaman & selalu up-to-date dengan tren rambut masa kini.",
  },
  {
    icon: <Wind className="w-10 h-10 text-juragan-red" />,
    title: "Tempat Nyaman & AC",
    description: "Free wifi, Free drink, Handuk hangat, Netflix, bersih, dingin, dan santai untuk pengalaman terbaik.",
  },
  {
    icon: <Award className="w-10 h-10 text-juragan-red" />,
    title: "Produk Premium",
    description: "Menggunakan pomade, tonic, dan perawatan rambut berkualitas.",
  },
  {
    icon: <MessageCircle className="w-10 h-10 text-juragan-red" />,
    title: "Free Konsultasi",
    description: "Konsultasi gaya rambut yang cocok dengan bentuk wajah Anda.",
  },
];

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="py-24 bg-juragan-dark">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-5xl font-bold mb-4"
          >
            Keunggulan <span className="text-juragan-red">Kami</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-24 h-1 bg-juragan-red mx-auto rounded-full"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto justify-center">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-juragan-darker p-6 rounded-2xl border border-gray-800 hover:border-juragan-red/50 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="bg-juragan-dark w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold mb-2 text-white group-hover:text-juragan-red transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
