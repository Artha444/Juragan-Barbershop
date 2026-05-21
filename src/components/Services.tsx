"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface Service {
  id: string;
  name: string;
  price: string;
  features: string[];
  popular: boolean;
  special_badge?: string | null;
  discount_note?: string | null;
}

interface ServicesProps {
  servicesData: Service[];
}

export default function Services({ servicesData }: ServicesProps) {
  return (
    <section id="services" className="py-24 bg-juragan-darker relative">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-juragan-red/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-juragan-red/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-5xl font-bold mb-4"
          >
            Layanan <span className="text-juragan-red">& Harga</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-24 h-1 bg-juragan-red mx-auto rounded-full"
          />
        </div>

        {servicesData.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            Belum ada paket layanan yang ditambahkan.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto justify-center">
            {servicesData.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-juragan-dark p-6 rounded-2xl border ${
                  service.popular
                    ? "border-juragan-red shadow-[0_0_30px_rgba(230,0,0,0.15)]"
                    : service.special_badge
                    ? "border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.15)]"
                    : "border-gray-800"
                } hover:border-juragan-red/50 hover:shadow-lg transition-all duration-300 group flex flex-col`}
              >
                {/* Paling Laris badge — merah, di atas kartu */}
                {service.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-juragan-red text-white text-xs font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-md shadow-juragan-red/30">
                    Paling Laris
                  </div>
                )}

                <h3 className="text-lg font-bold mb-2 text-white group-hover:text-juragan-red transition-colors">{service.name}</h3>
                <div className="text-4xl font-black text-juragan-red mb-3">{service.price}</div>

                {/* Label Emas Spesial — di bawah harga */}
                {service.special_badge && (() => {
                  const clean = service.special_badge.trim();
                  const badgeText = clean.toLowerCase().includes("keramas") ? clean : `Keramas +${clean}`;
                  return (
                    <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full px-3 py-1.5 text-xs text-amber-400 font-bold uppercase tracking-wider mb-4 w-fit hover:bg-amber-500/20 transition-all duration-300">
                      <span>✦ {badgeText}</span>
                    </div>
                  );
                })()}

                {service.discount_note && (
                  <div className="mb-6 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-400 font-semibold flex items-center justify-center text-center">
                    {service.discount_note}
                  </div>
                )}

                <div className="flex-grow">
                  <ul className="space-y-4 mb-8">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-gray-300">
                        <CheckCircle2 className="w-5 h-5 text-juragan-red shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
