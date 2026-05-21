"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect, useTransition } from "react";
import { X, Calendar, Clock, Sparkles, Check, User, Phone, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createBooking, getOccupiedTimes } from "@/app/actions/booking";

interface Service {
  id: string;
  name: string;
  price: string;
  features: string[];
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  currentUser: {
    id: string;
    email?: string;
    user_metadata?: {
      full_name?: string;
    };
  } | null;
  businessWhatsapp?: string;
}

const AVAILABLE_HOURS = [
  "10:00", "11:00", "12:00", "13:00", "14:00", "15:00",
  "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"
];

export default function BookingModal({
  isOpen,
  onClose,
  services,
  currentUser,
  businessWhatsapp = "082229989429",
}: BookingModalProps) {
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [occupiedHours, setOccupiedHours] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [whatsappUrl, setWhatsappUrl] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  // Prefill user details if logged in
  useEffect(() => {
    if (currentUser) {
      setCustomerName(currentUser.user_metadata?.full_name || "");
    }
  }, [currentUser]);

  // Fetch occupied slots when date changes
  useEffect(() => {
    if (selectedDate) {
      setSelectedTime("");
      getOccupiedTimes(selectedDate).then((times) => {
        setOccupiedHours(times);
      });
    } else {
      setOccupiedHours([]);
    }
  }, [selectedDate]);

  // Reset modal state on close/open
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setSuccess(false);
      setSelectedService("");
      setSelectedDate("");
      setSelectedTime("");
      setWhatsappUrl("");
      if (currentUser) {
        setCustomerName(currentUser.user_metadata?.full_name || "");
      } else {
        setCustomerName("");
      }
      setCustomerPhone("");
    }
  }, [isOpen, currentUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedDate || !selectedTime || !customerName || !customerPhone) {
      setError("Semua kolom harus diisi!");
      return;
    }

    startTransition(async () => {
      const res = await createBooking({
        customerName,
        customerPhone,
        serviceId: selectedService,
        bookingDate: selectedDate,
        bookingTime: selectedTime,
      });

      if (res.error) {
        setError(res.error);
      } else {
        const serviceName = services.find((s) => s.id === selectedService)?.name || "";
        const formattedDate = new Date(selectedDate).toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        });
        const message = `Halo Admin, saya ${customerName} ingin mengonfirmasi booking pangkas untuk paket ${serviceName} pada tanggal ${formattedDate} jam ${selectedTime}.`;
        const encodedMessage = encodeURIComponent(message);
        
        let cleanShopPhone = businessWhatsapp;
        if (cleanShopPhone.startsWith("0")) {
          cleanShopPhone = "62" + cleanShopPhone.substring(1);
        }
        const waUrl = `https://wa.me/${cleanShopPhone.replace(/\D/g, "")}?text=${encodedMessage}`;
        
        setWhatsappUrl(waUrl);
        setSuccess(true);

        try {
          window.open(waUrl, "_blank");
        } catch (err) {
          console.error("Popup blocked", err);
        }
      }
    });
  };

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-juragan-dark border border-gray-800 rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-8 py-6 border-b border-gray-800 shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-juragan-red" />
                <h3 className="font-display font-bold text-xl text-white tracking-wider">
                  PILIH JADWAL CUKUR
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-1 bg-juragan-darker rounded-full border border-gray-800"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-8 overflow-y-auto flex-grow space-y-6">
              {success ? (
                /* Success state */
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
                  <div className="bg-emerald-500/10 p-6 rounded-full border border-emerald-500/20">
                    <Check className="w-16 h-16 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-white mb-2">Reservasi Berhasil Direkam!</h4>
                    <p className="text-gray-400 max-w-md mx-auto text-sm leading-relaxed">
                      Jadwal Anda telah disimpan di sistem kami. Silakan klik tombol di bawah ini untuk mengirim konfirmasi WhatsApp langsung ke Admin Juragan Barbershop.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer w-full text-center"
                    >
                      <Phone size={18} />
                      Konfirmasi via WhatsApp
                    </a>
                    <button
                      onClick={onClose}
                      className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-full font-bold transition-all w-full cursor-pointer"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              ) : (
                /* Form State (Fully Public) */
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl text-sm text-center">
                      {error}
                    </div>
                  )}

                  {/* 1. Services selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Pilih Layanan / Paket
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {services.map((service) => (
                        <div
                          key={service.id}
                          onClick={() => setSelectedService(service.id)}
                          className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                            selectedService === service.id
                              ? "bg-juragan-red/10 border-juragan-red shadow-[0_0_15px_rgba(230,0,0,0.1)]"
                              : "bg-juragan-darker border-gray-800 hover:border-gray-700"
                          }`}
                        >
                          <div className="font-bold text-white">{service.name}</div>
                          <div className="text-juragan-red font-black mt-2">{service.price}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 2. Customer details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nama Lengkap
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                        <input
                          type="text"
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Nama Anda"
                          className="w-full pl-9 pr-4 py-2.5 bg-juragan-darker border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-juragan-red transition-colors text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nomor HP / WhatsApp
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                        <input
                          type="tel"
                          required
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="Contoh: 08123456789"
                          className="w-full pl-9 pr-4 py-2.5 bg-juragan-darker border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-juragan-red transition-colors text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. Date & Time Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Pilih Tanggal
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />
                        <input
                          type="date"
                          required
                          min={todayStr}
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 bg-juragan-darker border border-gray-800 rounded-xl text-white focus:outline-none focus:border-juragan-red transition-colors text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Pilih Jam Operasional
                      </label>
                      {!selectedDate ? (
                        <div className="h-[42px] border border-dashed border-gray-800 rounded-xl flex items-center justify-center text-xs text-gray-500">
                          Pilih tanggal terlebih dahulu
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1">
                          {AVAILABLE_HOURS.map((time) => {
                            const isOccupied = occupiedHours.includes(time);
                            return (
                              <button
                                key={time}
                                type="button"
                                disabled={isOccupied}
                                onClick={() => setSelectedTime(time)}
                                className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                                  selectedTime === time
                                    ? "bg-juragan-red text-white border-juragan-red"
                                    : isOccupied
                                    ? "bg-gray-950 border-gray-900 text-gray-700 cursor-not-allowed"
                                    : "bg-juragan-darker border-gray-800 text-gray-300 hover:border-gray-700"
                                }`}
                              >
                                {time}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 shrink-0">
                    <button
                      type="submit"
                      disabled={isPending}
                      className="w-full py-3.5 bg-juragan-red hover:bg-red-700 disabled:bg-red-950 disabled:text-gray-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-juragan-red/30 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Menyimpan Reservasi...</span>
                        </>
                      ) : (
                        <span>Konfirmasi Reservasi</span>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
