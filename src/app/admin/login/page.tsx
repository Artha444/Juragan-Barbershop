"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { login } from "@/app/auth/actions";
import { Lock, Mail, Loader2, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await login(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  return (
    <main className="min-h-screen bg-juragan-darker flex flex-col items-center justify-center p-6 relative">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-juragan-red/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-juragan-red/5 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md bg-juragan-dark border border-gray-800 rounded-2xl p-8 shadow-2xl relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Kembali ke Beranda
        </Link>

        <div className="flex flex-col items-center mb-8">
          <Image
            src="/logo.jpg"
            alt="Juragan Barbershop Logo"
            width={180}
            height={60}
            className="h-16 w-auto object-contain rounded-lg mb-4"
          />
          <h2 className="text-2xl font-display font-bold text-white tracking-wider">
            MASUK KE AKUN
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Masuk untuk mengakses dashboard admin
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg text-sm mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="email"
                name="email"
                required
                placeholder="admin@email.com"
                className="w-full pl-11 pr-4 py-3 bg-juragan-darker border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-juragan-red transition-colors text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-juragan-darker border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-juragan-red transition-colors text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 bg-juragan-red hover:bg-red-700 disabled:bg-red-950 disabled:text-gray-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-juragan-red/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <span>Masuk Sekarang</span>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
