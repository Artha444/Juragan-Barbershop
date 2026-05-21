"use client";

import { useState, useTransition } from "react";
import { addGalleryItem, deleteGalleryItem, uploadImage } from "@/app/actions/admin";
import { Plus, Trash2, Upload, Loader2, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface GalleryItem {
  id: string;
  image_url: string;
  title: string;
}

interface GalleryManagementProps {
  initialGallery: GalleryItem[];
}

export default function GalleryManagement({ initialGallery }: GalleryManagementProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ success?: string; error?: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setStatus(null);

    startTransition(async () => {
      // 1. Upload photo to Supabase storage
      const formData = new FormData();
      formData.append("file", file);
      
      const uploadRes = await uploadImage(formData, "gallery");
      if (uploadRes.error) {
        setStatus({ error: `Gagal mengunggah foto: ${uploadRes.error}. (Pastikan Storage Bucket 'barbershop-assets' sudah dibuat di Supabase)` });
        return;
      }

      if (uploadRes.publicUrl) {
        // 2. Save image details in the database
        const saveRes = await addGalleryItem(title, uploadRes.publicUrl);
        if (saveRes.error) {
          setStatus({ error: saveRes.error });
        } else {
          setStatus({ success: "Foto portofolio berhasil ditambahkan!" });
          setIsAdding(false);
          setTitle("");
          setFile(null);
          setPreview(null);
        }
      }
    });
  };

  const handleDelete = (id: string, imageUrl: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus foto portofolio ini?")) return;
    setStatus(null);

    // Try to extract storage path to delete it
    // URL format: .../storage/v1/object/public/barbershop-assets/gallery/1234567.jpg
    let storagePath: string | undefined;
    if (imageUrl.includes("barbershop-assets/")) {
      storagePath = imageUrl.split("barbershop-assets/")[1];
    }

    startTransition(async () => {
      const res = await deleteGalleryItem(id, storagePath);
      if (res.error) {
        setStatus({ error: res.error });
      } else {
        setStatus({ success: "Foto portofolio berhasil dihapus!" });
      }
    });
  };

  return (
    <div className="space-y-6">
      {status?.error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm max-w-4xl">
          {status.error}
        </div>
      )}
      {status?.success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-sm max-w-4xl">
          {status.success}
        </div>
      )}

      {isAdding ? (
        /* Add Photo View */
        <div className="bg-juragan-dark border border-gray-800 rounded-2xl p-6 shadow-xl max-w-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-juragan-red" />
              Unggah Foto Portofolio Baru
            </h2>
            <button
              onClick={() => {
                setIsAdding(false);
                setPreview(null);
                setFile(null);
              }}
              className="text-gray-400 hover:text-white p-1.5 bg-juragan-darker rounded-lg border border-gray-800"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleAddSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Judul Potongan / Gaya Rambut (Opsional)
              </label>
              <input
                type="text"
                placeholder="Contoh: Fade Haircut"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-juragan-darker border border-gray-800 rounded-xl text-white focus:outline-none focus:border-juragan-red transition-colors text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Foto Hasil Potongan
              </label>
              <div className="space-y-4">
                {preview && (
                  <div className="relative aspect-[4/5] w-full max-w-[240px] mx-auto rounded-xl overflow-hidden border border-gray-800 bg-gray-950">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-800 border-dashed rounded-xl cursor-pointer bg-juragan-darker hover:bg-gray-900 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 text-gray-500 mb-2" />
                      <p className="mb-2 text-sm text-gray-400">
                        <span className="font-semibold">Klik untuk unggah</span>
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, JPEG atau WEBP (Maks. 2MB)</p>
                    </div>
                    <input
                      type="file"
                      required
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending || !file}
              className="w-full py-3 bg-juragan-red hover:bg-red-700 disabled:bg-red-950 disabled:text-gray-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-juragan-red/10"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Mengunggah...</span>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  <span>Unggah Sekarang</span>
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        /* Photo Grid View */
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Foto Portfolio Aktif</h2>
            <button
              onClick={() => {
                setStatus(null);
                setIsAdding(true);
              }}
              className="bg-juragan-red hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-1.5 transition-all shadow-lg shadow-juragan-red/20 cursor-pointer"
            >
              <Plus size={16} />
              Unggah Foto Baru
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl">
            {initialGallery.map((item) => (
              <div
                key={item.id}
                className="relative aspect-[4/5] rounded-xl overflow-hidden border border-gray-800 bg-gray-950 group"
              >
                <Image
                  src={item.image_url}
                  alt={item.title || "Portfolio"}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Hover overlay with Delete Button */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 z-10">
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-widest truncate">
                    {item.title || "No Title"}
                  </div>

                  <button
                    onClick={() => handleDelete(item.id, item.image_url)}
                    className="self-end p-2 bg-red-650 hover:bg-red-700 text-white rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {initialGallery.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              Belum ada foto portofolio. Klik &quot;Unggah Foto Baru&quot; untuk menambahkan yang pertama.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
