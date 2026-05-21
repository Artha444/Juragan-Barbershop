"use client";

import { useState, useTransition } from "react";
import { updateContent, uploadImage } from "@/app/actions/admin";
import { Save, Loader2, Sparkles, Phone, Clock, MapPin, Upload } from "lucide-react";

interface ContentFormProps {
  heroData: {
    title: string;
    description: string;
    bg_image: string;
  };
  businessData: {
    whatsapp: string;
    open_time: string;
    close_time: string;
    address: string;
  };
}

export default function ContentForm({ heroData, businessData }: ContentFormProps) {
  const [heroTitle, setHeroTitle] = useState(heroData.title);
  const [heroDesc, setHeroDesc] = useState(heroData.description);
  const [heroBg, setHeroBg] = useState(heroData.bg_image);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPreview, setHeroPreview] = useState<string | null>(null);

  const [wa, setWa] = useState(businessData.whatsapp);
  const [openTime, setOpenTime] = useState(businessData.open_time);
  const [closeTime, setCloseTime] = useState(businessData.close_time);
  const [address, setAddress] = useState(businessData.address);

  const [heroPending, startHeroTransition] = useTransition();
  const [bizPending, startBizTransition] = useTransition();

  const [heroStatus, setHeroStatus] = useState<{ success?: string; error?: string } | null>(null);
  const [bizStatus, setBizStatus] = useState<{ success?: string; error?: string } | null>(null);

  const handleHeroFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHeroFile(file);
      setHeroPreview(URL.createObjectURL(file));
    }
  };

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHeroStatus(null);

    startHeroTransition(async () => {
      let currentBg = heroBg;

      // Upload background image if a new one is selected
      if (heroFile) {
        const formData = new FormData();
        formData.append("file", heroFile);
        const uploadRes = await uploadImage(formData, "hero");
        if (uploadRes.error) {
          setHeroStatus({ error: `Gagal mengunggah gambar: ${uploadRes.error}. (Pastikan Storage Bucket 'barbershop-assets' sudah dibuat di Supabase)` });
          return;
        }
        if (uploadRes.publicUrl) {
          currentBg = uploadRes.publicUrl;
          setHeroBg(currentBg);
          setHeroFile(null);
          setHeroPreview(null);
        }
      }

      const res = await updateContent("hero", {
        title: heroTitle,
        description: heroDesc,
        bg_image: currentBg,
      });

      if (res.error) {
        setHeroStatus({ error: res.error });
      } else {
        setHeroStatus({ success: "Konten Banner Hero berhasil diperbarui!" });
      }
    });
  };

  const handleBizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBizStatus(null);

    startBizTransition(async () => {
      const res = await updateContent("business_info", {
        whatsapp: wa,
        open_time: openTime,
        close_time: closeTime,
        address: address,
      });

      if (res.error) {
        setBizStatus({ error: res.error });
      } else {
        setBizStatus({ success: "Informasi Bisnis berhasil diperbarui!" });
      }
    });
  };

  return (
    <>
      {/* 1. Hero Content Form */}
      <div className="bg-juragan-dark border border-gray-800 rounded-2xl p-6 shadow-xl space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-juragan-red" />
          Banner Hero Section
        </h2>

        {heroStatus?.error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm">
            {heroStatus.error}
          </div>
        )}
        {heroStatus?.success && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-sm">
            {heroStatus.success}
          </div>
        )}

        <form onSubmit={handleHeroSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Judul Utama (Title)
            </label>
            <input
              type="text"
              required
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="w-full px-4 py-3 bg-juragan-darker border border-gray-800 rounded-xl text-white focus:outline-none focus:border-juragan-red transition-colors text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Deskripsi Singkat (Description)
            </label>
            <textarea
              required
              rows={3}
              value={heroDesc}
              onChange={(e) => setHeroDesc(e.target.value)}
              className="w-full px-4 py-3 bg-juragan-darker border border-gray-800 rounded-xl text-white focus:outline-none focus:border-juragan-red transition-colors text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Gambar Background Banner
            </label>
            <div className="space-y-4">
              {/* Image Preview */}
              <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-800 bg-gray-950">
                <img
                  src={heroPreview || heroBg}
                  alt="Background Preview"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Upload Input */}
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-800 border-dashed rounded-xl cursor-pointer bg-juragan-darker hover:bg-gray-900 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 text-gray-500 mb-2" />
                    <p className="mb-2 text-sm text-gray-400">
                      <span className="font-semibold">Klik untuk unggah</span> atau seret file gambar
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, JPEG atau WEBP (Maks. 2MB)</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleHeroFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={heroPending}
            className="w-full py-3 bg-juragan-red hover:bg-red-700 disabled:bg-red-950 disabled:text-gray-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-juragan-red/10"
          >
            {heroPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Menyimpan Perubahan...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Simpan Konten Hero</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* 2. Business Info Form */}
      <div className="bg-juragan-dark border border-gray-800 rounded-2xl p-6 shadow-xl space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Phone className="w-5 h-5 text-juragan-red" />
          Informasi Bisnis & Kontak
        </h2>

        {bizStatus?.error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm">
            {bizStatus.error}
          </div>
        )}
        {bizStatus?.success && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-sm">
            {bizStatus.success}
          </div>
        )}

        <form onSubmit={handleBizSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              No. WhatsApp Admin
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="text"
                required
                value={wa}
                onChange={(e) => setWa(e.target.value)}
                placeholder="Contoh: 082229989429"
                className="w-full pl-9 pr-4 py-3 bg-juragan-darker border border-gray-800 rounded-xl text-white focus:outline-none focus:border-juragan-red transition-colors text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Jam Buka
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input
                  type="text"
                  required
                  value={openTime}
                  onChange={(e) => setOpenTime(e.target.value)}
                  placeholder="Format: 10:00"
                  className="w-full pl-9 pr-4 py-3 bg-juragan-darker border border-gray-800 rounded-xl text-white focus:outline-none focus:border-juragan-red transition-colors text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Jam Tutup
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input
                  type="text"
                  required
                  value={closeTime}
                  onChange={(e) => setCloseTime(e.target.value)}
                  placeholder="Format: 22:00"
                  className="w-full pl-9 pr-4 py-3 bg-juragan-darker border border-gray-800 rounded-xl text-white focus:outline-none focus:border-juragan-red transition-colors text-sm"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Alamat Barbershop
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-500 w-4 h-4" />
              <textarea
                required
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-juragan-darker border border-gray-800 rounded-xl text-white focus:outline-none focus:border-juragan-red transition-colors text-sm resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={bizPending}
            className="w-full py-3 bg-juragan-red hover:bg-red-700 disabled:bg-red-950 disabled:text-gray-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-juragan-red/10"
          >
            {bizPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Menyimpan Perubahan...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Simpan Info Bisnis</span>
              </>
            )}
          </button>
        </form>
      </div>
    </>
  );
}
