import { createClient } from "@/utils/supabase/server";
import {
  Calendar,
  CheckCircle,
  Clock,
  Scissors,
  Image as ImageIcon,
  User,
} from "lucide-react";
import BookingTable from "@/components/admin/BookingTable";

export const revalidate = 0;

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch stats and lists
  const { data: bookingsData } = await supabase
    .from("bookings")
    .select(`
      *,
      services (
        name
      )
    `)
    .order("created_at", { ascending: false });

  const { count: servicesCount } = await supabase
    .from("services")
    .select("*", { count: "exact", head: true });

  const { count: galleryCount } = await supabase
    .from("gallery")
    .select("*", { count: "exact", head: true });

  const bookings = bookingsData || [];
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b) => b.status === "pending").length;
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed").length;
  const completedBookings = bookings.filter((b) => b.status === "completed").length;

  const statCards = [
    {
      title: "Total Reservasi",
      value: totalBookings,
      icon: <Calendar className="w-6 h-6 text-blue-500" />,
      bg: "bg-blue-500/10 border-blue-500/20",
    },
    {
      title: "Menunggu Konfirmasi",
      value: pendingBookings,
      icon: <Clock className="w-6 h-6 text-yellow-500" />,
      bg: "bg-yellow-500/10 border-yellow-500/20",
    },
    {
      title: "Sudah Dikonfirmasi",
      value: confirmedBookings,
      icon: <CheckCircle className="w-6 h-6 text-emerald-500" />,
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Daftar Layanan",
      value: servicesCount || 0,
      icon: <Scissors className="w-6 h-6 text-amber-500" />,
      bg: "bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "Foto Galeri",
      value: galleryCount || 0,
      icon: <ImageIcon className="w-6 h-6 text-purple-500" />,
      bg: "bg-purple-500/10 border-purple-500/20",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-white tracking-wider">
          DASHBOARD UTAMA
        </h1>
        <p className="text-gray-400 mt-1">
          Pantau reservasi customer dan statistik barbershop hari ini.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card) => (
          <div
            key={card.title}
            className={`p-6 rounded-2xl border ${card.bg} flex flex-col justify-between`}
          >
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-gray-400">
                {card.title}
              </span>
              {card.icon}
            </div>
            <div className="text-3xl font-black text-white mt-4">
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* Bookings Table Component */}
      <div className="bg-juragan-dark border border-gray-800 rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-juragan-red" />
          Daftar Antrean Reservasi
        </h2>
        <BookingTable bookingsData={bookings} />
      </div>
    </div>
  );
}
