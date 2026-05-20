"use client";

import { motion } from "framer-motion";
import { MapPin, Clock, Phone, MessageCircle } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-juragan-darker">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="font-display text-4xl md:text-5xl font-bold mb-4"
            >
              Kunjungi <span className="text-juragan-red">Kami</span>
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="w-24 h-1 bg-juragan-red mb-10 rounded-full"
            />

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-juragan-red/10 p-3 rounded-full">
                  <MapPin className="w-6 h-6 text-juragan-red" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Lokasi</h4>
                  <p className="text-gray-400">
                    Jl. Adi Sucipta, Pamoyanan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43212
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-juragan-red/10 p-3 rounded-full">
                  <Clock className="w-6 h-6 text-juragan-red" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Jam Buka</h4>
                  <p className="text-gray-400">Senin - Minggu</p>
                  <p className="text-juragan-red font-bold">10:00 - 22:00</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-juragan-red/10 p-3 rounded-full">
                  <Phone className="w-6 h-6 text-juragan-red" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Kontak & Booking</h4>
                  <p className="text-gray-400 mb-2">Hubungi kami untuk reservasi atau pertanyaan.</p>
                  <a href="https://wa.me/082229989429" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20b858] text-white px-6 py-2 rounded-full font-bold transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp Kami
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-12 border-t border-gray-800">
              <h4 className="text-xl font-bold text-white mb-6">Sosial Media</h4>
              <div className="flex gap-4">
                <a href="#" className="bg-gray-900 px-6 py-3 rounded-full hover:bg-juragan-red hover:text-white transition-colors text-gray-400 font-semibold">
                  Instagram
                </a>
                <a href="#" className="bg-gray-900 px-6 py-3 rounded-full hover:bg-juragan-red hover:text-white transition-colors text-gray-400 font-semibold">
                  Facebook
                </a>
              </div>
            </div>
          </div>

          {/* Maps */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="h-[500px] w-full rounded-2xl overflow-hidden border-2 border-gray-800 relative group"
          >
            {/* Placeholder for iframe Google Maps */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.0331056443146!2d107.13486067608204!3d-6.824982599999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68532ac14ebba9%3A0xa430f74c02f465d9!2sJuragan%20barbershop!5e0!3m2!1sid!2sid!4v1747657453771!5m2!1sid!2sid"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale group-hover:grayscale-0 transition-all duration-700"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
