"use client";

import { useState } from "react";
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
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { signout } from "@/app/auth/actions";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

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
    <div className="flex h-screen bg-juragan-darker text-white overflow-hidden relative">
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-juragan-dark border-r border-gray-800 flex flex-col justify-between shrink-0 transition-all duration-300 ease-in-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${isCollapsed ? "w-20" : "w-64"}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Brand */}
          <div className={`px-4 py-6 border-b border-gray-800 flex items-center shrink-0 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            {!isCollapsed ? (
              <div className="flex flex-col">
                <Image
                  src="/logo.jpg"
                  alt="Juragan Barbershop Logo"
                  width={120}
                  height={40}
                  className="h-8 w-auto object-contain rounded-lg mb-1"
                />
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1">
                  <Sparkles size={10} />
                  ADMIN PANEL
                </span>
              </div>
            ) : (
              <Image
                src="/logo.jpg"
                alt="Logo"
                width={40}
                height={40}
                className="h-10 w-10 object-cover rounded-lg"
              />
            )}
            
            {/* Desktop Collapse Button */}
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-1.5 rounded-lg bg-gray-900/50 text-gray-400 hover:text-white border border-gray-800 hover:bg-gray-800 transition-colors"
            >
              {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
            {/* Mobile Close Button */}
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg bg-gray-900/50 text-gray-400 hover:text-white border border-gray-800"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-2 flex-grow overflow-y-auto overflow-x-hidden">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  title={isCollapsed ? item.name : undefined}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all group ${
                    isActive
                      ? "bg-juragan-red text-white shadow-lg shadow-juragan-red/10"
                      : "text-gray-400 hover:text-white hover:bg-gray-900"
                  } ${isCollapsed ? "justify-center" : ""}`}
                >
                  <div className="shrink-0 group-hover:scale-110 transition-transform duration-200">
                    {item.icon}
                  </div>
                  {!isCollapsed && <span className="truncate whitespace-nowrap">{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-800 space-y-2 shrink-0">
          <Link
            href="/"
            title={isCollapsed ? "Lihat Website" : undefined}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-gray-400 hover:text-white hover:bg-gray-900 transition-all group ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <div className="shrink-0 group-hover:scale-110 transition-transform duration-200"><Home size={20} /></div>
            {!isCollapsed && <span className="truncate whitespace-nowrap">Lihat Website</span>}
          </Link>
          <form action={signout} className="w-full">
            <button
              type="submit"
              title={isCollapsed ? "Keluar" : undefined}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-red-400 hover:text-white hover:bg-red-500/20 transition-all group ${
                isCollapsed ? "justify-center" : ""
              }`}
            >
              <div className="shrink-0 group-hover:scale-110 transition-transform duration-200"><LogOut size={20} /></div>
              {!isCollapsed && <span className="truncate whitespace-nowrap">Keluar</span>}
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-juragan-dark border-b border-gray-800 px-6 py-4 flex items-center justify-between shrink-0 shadow-sm z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="p-2 -ml-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="flex flex-col">
              <span className="font-bold text-white text-lg leading-tight">Admin Panel</span>
              <span className="text-[10px] text-amber-400 uppercase tracking-widest font-semibold">Juragan Barbershop</span>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-10">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
