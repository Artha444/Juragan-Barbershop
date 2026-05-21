"use client";

import { useState, useTransition } from "react";
import { saveService, deleteService } from "@/app/actions/admin";
import { Plus, Edit2, Trash2, CheckCircle2, Save, X, Loader2, Sparkles } from "lucide-react";

interface Service {
  id: string;
  name: string;
  price: string;
  features: string[];
  popular: boolean;
  special_badge?: string | null;
  discount_note?: string | null;
}

interface ServicesManagementProps {
  initialServices: Service[];
}

export default function ServicesManagement({ initialServices }: ServicesManagementProps) {
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [newFeatureText, setNewFeatureText] = useState("");
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ success?: string; error?: string } | null>(null);

  const handleCreateNew = () => {
    setStatus(null);
    setEditingService({
      name: "",
      price: "",
      features: [],
      popular: false,
      special_badge: "",
      discount_note: "",
    });
  };

  const handleEdit = (service: Service) => {
    setStatus(null);
    setEditingService({ ...service });
  };

  const handleDelete = (serviceId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus layanan ini?")) return;
    setStatus(null);

    startTransition(async () => {
      const res = await deleteService(serviceId);
      if (res.error) {
        setStatus({ error: res.error });
      } else {
        setStatus({ success: "Layanan berhasil dihapus!" });
      }
    });
  };

  const handleAddFeature = () => {
    if (!newFeatureText.trim() || !editingService) return;
    const features = editingService.features || [];
    setEditingService({
      ...editingService,
      features: [...features, newFeatureText.trim()],
    });
    setNewFeatureText("");
  };

  const handleRemoveFeature = (idx: number) => {
    if (!editingService) return;
    const features = editingService.features || [];
    setEditingService({
      ...editingService,
      features: features.filter((_, i) => i !== idx),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService || !editingService.name || !editingService.price) return;
    setStatus(null);

    startTransition(async () => {
      const res = await saveService({
        id: editingService.id,
        name: editingService.name!,
        price: editingService.price!,
        features: editingService.features || [],
        popular: !!editingService.popular,
        special_badge: editingService.special_badge || null,
        discount_note: editingService.discount_note || null,
      });

      if (res.error) {
        setStatus({ error: res.error });
      } else {
        setStatus({ success: "Layanan berhasil disimpan!" });
        setEditingService(null);
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

      {editingService ? (
        /* Edit/Create Form View */
        <div className="bg-juragan-dark border border-gray-800 rounded-2xl p-6 shadow-xl max-w-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-juragan-red" />
              {editingService.id ? "Edit Paket Layanan" : "Tambah Paket Layanan Baru"}
            </h2>
            <button
              onClick={() => setEditingService(null)}
              className="text-gray-400 hover:text-white p-1.5 bg-juragan-darker rounded-lg border border-gray-800"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nama Layanan
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Juragan Haircut"
                  value={editingService.name || ""}
                  onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                  className="w-full px-4 py-3 bg-juragan-darker border border-gray-800 rounded-xl text-white focus:outline-none focus:border-juragan-red transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Harga
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rp 35.000"
                  value={editingService.price || ""}
                  onChange={(e) => setEditingService({ ...editingService, price: e.target.value })}
                  className="w-full px-4 py-3 bg-juragan-darker border border-gray-800 rounded-xl text-white focus:outline-none focus:border-juragan-red transition-colors text-sm"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="popular"
                checked={!!editingService.popular}
                onChange={(e) => setEditingService({ ...editingService, popular: e.target.checked })}
                className="w-4 h-4 rounded text-juragan-red focus:ring-juragan-red bg-juragan-darker border-gray-800"
              />
              <label htmlFor="popular" className="text-sm font-medium text-gray-300 cursor-pointer">
                Tandai sebagai &quot;Paling Laris&quot; (Popular)
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Label Emas Spesial (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Keramas + 5.000"
                  value={editingService.special_badge || ""}
                  onChange={(e) => setEditingService({ ...editingService, special_badge: e.target.value })}
                  className="w-full px-4 py-3 bg-juragan-darker border border-gray-800 rounded-xl text-white focus:outline-none focus:border-juragan-red transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Catatan Diskon / Cashback (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Diskon 10% Cashback"
                  value={editingService.discount_note || ""}
                  onChange={(e) => setEditingService({ ...editingService, discount_note: e.target.value })}
                  className="w-full px-4 py-3 bg-juragan-darker border border-gray-800 rounded-xl text-white focus:outline-none focus:border-juragan-red transition-colors text-sm"
                />
              </div>
            </div>

            {/* Features Creator */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-300">
                Fitur / Keunggulan Layanan
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Contoh: Pijat Kepala"
                  value={newFeatureText}
                  onChange={(e) => setNewFeatureText(e.target.value)}
                  className="flex-grow px-4 py-2.5 bg-juragan-darker border border-gray-800 rounded-xl text-white focus:outline-none focus:border-juragan-red transition-colors text-sm"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={16} />
                  Tambah
                </button>
              </div>

              {/* Features List */}
              <ul className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {(editingService.features || []).map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between items-center bg-juragan-darker px-4 py-2 rounded-lg border border-gray-800 text-sm text-gray-300"
                  >
                    <span className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-juragan-red" />
                      {feature}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="text-red-500 hover:text-red-400 p-0.5 rounded"
                    >
                      <X size={14} />
                    </button>
                  </li>
                ))}
                {(editingService.features || []).length === 0 && (
                  <li className="text-xs text-gray-500 italic py-2">Belum ada fitur ditambahkan.</li>
                )}
              </ul>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="flex-grow py-3 bg-juragan-red hover:bg-red-700 disabled:bg-red-950 disabled:text-gray-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-juragan-red/10"
              >
                {isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Simpan Paket</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl transition-all cursor-pointer"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Services List View */
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Daftar Paket Aktif</h2>
            <button
              onClick={handleCreateNew}
              className="bg-juragan-red hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-1.5 transition-all shadow-lg shadow-juragan-red/20 cursor-pointer"
            >
              <Plus size={16} />
              Tambah Layanan
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
            {initialServices.map((service) => (
              <div
                key={service.id}
                className={`relative bg-juragan-dark p-6 rounded-2xl border ${
                  service.special_badge
                    ? "border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.1)]"
                    : service.popular
                    ? "border-juragan-red"
                    : "border-gray-800"
                } flex flex-col justify-between`}
              >
                {service.special_badge ? (
                  <span className="absolute -top-3 left-6 bg-amber-500 text-black text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm shadow-amber-500/10">
                    {service.special_badge}
                  </span>
                ) : service.popular ? (
                  <span className="absolute -top-3 left-6 bg-juragan-red text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                    Paling Laris
                  </span>
                ) : null}
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{service.name}</h3>
                  <div className="text-2xl font-black text-juragan-red mb-4">{service.price}</div>
                  {service.discount_note && (
                    <div className="mb-4 bg-amber-500/10 border border-amber-500/20 rounded-xl p-2.5 text-[10px] text-amber-400 font-semibold text-center">
                      {service.discount_note}
                    </div>
                  )}
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-juragan-red shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex gap-2 border-t border-gray-800 pt-4 mt-auto">
                  <button
                    onClick={() => handleEdit(service)}
                    className="flex-grow flex items-center justify-center gap-1 py-2 bg-gray-900 border border-gray-800 hover:bg-gray-800 text-gray-300 hover:text-white rounded-lg text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Edit2 size={12} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="p-2 bg-red-950/20 hover:bg-red-950 border border-red-900/30 text-red-500 hover:text-red-400 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {initialServices.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              Belum ada paket layanan. Klik &quot;Tambah Layanan&quot; untuk membuat yang pertama.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
