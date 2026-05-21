"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Scissors,
  Image as ImageIcon,
  Home,
  LogOut,
  Sparkles,
} from "lucide-react";
import { signout } from "@/app/auth/actions";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Dashboard & Booking",
      href: "/admin/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Konten & Informasi",
      href: "/admin/dashboard/content",
      icon: <FileText size={20} />,
    },
    {
      name: "Paket Layanan",
      href: "/admin/dashboard/services",
      icon: <Scissors size={20} />,
    },
    {
      name: "Galeri Portofolio",
      href: "/admin/dashboard/gallery",
      icon: <ImageIcon size={20} />,
    },
  ];

  return (
    <div className="flex min-h-screen bg-juragan-darker text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-juragan-dark border-r border-gray-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo Brand */}
          <div className="px-6 py-8 border-b border-gray-800 flex flex-col items-center justify-center">
            <Image
              src="/logo.jpg"
              alt="Juragan Barbershop Logo"
              width={120}
              height={40}
              className="h-10 w-auto object-contain rounded-lg mb-2"
            />
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1">
              <Sparkles size={12} />
              ADMIN PANEL
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    isActive
                      ? "bg-juragan-red text-white shadow-lg shadow-juragan-red/10"
                      : "text-gray-400 hover:text-white hover:bg-gray-900"
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-800 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-400 hover:text-white hover:bg-gray-900 transition-all"
          >
            <Home size={20} />
            <span>Lihat Website</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-10 overflow-y-auto">{children}</main>
    </div>
  );
}
