"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface GalleryItem {
  id: string;
  image_url: string;
  title: string;
}

interface GalleryProps {
  galleryData: GalleryItem[];
}

export default function Gallery({ galleryData }: GalleryProps) {
  return (
    <section id="gallery" className="py-24 bg-juragan-dark">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-5xl font-bold mb-4"
          >
            Hasil <span className="text-juragan-red">Karya Kami</span>
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-24 h-1 bg-juragan-red mx-auto rounded-full"
          />
          <p className="mt-6 text-gray-400 max-w-2xl mx-auto">
            Lihat beberapa hasil potongan rambut terbaik dari kapster kami. Kami selalu memberikan yang terbaik untuk setiap pelanggan.
          </p>
        </div>

        {galleryData.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            Belum ada foto portofolio yang diunggah.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {galleryData.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative aspect-[4/5] rounded-xl overflow-hidden group cursor-pointer"
              >
                <Image
                  src={image.image_url}
                  alt={image.title || "Juragan Barbershop"}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {image.title && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <span className="text-juragan-red font-bold text-lg">{image.title}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
