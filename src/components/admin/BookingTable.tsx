"use client";

import { useTransition } from "react";
import { updateBookingStatus } from "@/app/actions/admin";
import { Check, X, CheckSquare, Loader2, Phone } from "lucide-react";

interface Booking {
  id: string;
  customer_name: string;
  customer_phone: string;
  booking_date: string;
  booking_time: string;
  status: string;
  created_at: string;
  services?: {
    name: string;
  } | null;
}

interface BookingTableProps {
  bookingsData: Booking[];
}

export default function BookingTable({ bookingsData }: BookingTableProps) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (bookingId: string, status: string) => {
    startTransition(async () => {
      await updateBookingStatus(bookingId, status);
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20";
      case "confirmed":
        return "bg-blue-500/10 text-blue-500 border border-blue-500/20";
      case "completed":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-500 border border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border border-gray-500/20";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Menunggu";
      case "confirmed":
        return "Dikonfirmasi";
      case "completed":
        return "Selesai";
      case "cancelled":
        return "Dibatalkan";
      default:
        return status;
    }
  };

  if (bookingsData.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12">
        Belum ada antrean reservasi masuk.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-800 text-gray-400 text-sm">
            <th className="pb-4 font-bold">Nama Customer</th>
            <th className="pb-4 font-bold">No. HP</th>
            <th className="pb-4 font-bold">Layanan</th>
            <th className="pb-4 font-bold">Tanggal</th>
            <th className="pb-4 font-bold">Waktu</th>
            <th className="pb-4 font-bold">Status</th>
            <th className="pb-4 font-bold text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800 text-sm">
          {bookingsData.map((booking: Booking) => (
            <tr key={booking.id} className="hover:bg-gray-900/50 transition-colors">
              <td className="py-4 text-white font-semibold">
                {booking.customer_name}
              </td>
              <td className="py-4 text-gray-300">
                <a
                  href={`https://wa.me/${booking.customer_phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
                >
                  <Phone size={14} className="text-emerald-500" />
                  {booking.customer_phone}
                </a>
              </td>
              <td className="py-4 text-gray-300">
                {booking.services?.name || "Layanan Dihapus"}
              </td>
              <td className="py-4 text-gray-300">
                {new Date(booking.booking_date).toLocaleDateString("id-ID", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </td>
              <td className="py-4 text-juragan-red font-bold">
                {booking.booking_time}
              </td>
              <td className="py-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusBadgeClass(booking.status)}`}>
                  {getStatusText(booking.status)}
                </span>
              </td>
              <td className="py-4 text-right">
                <div className="flex gap-2 justify-end">
                  {booking.status === "pending" && (
                    <>
                      <button
                        title="Konfirmasi"
                        disabled={isPending}
                        onClick={() => handleStatusChange(booking.id, "confirmed")}
                        className="p-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-500 hover:bg-blue-500 hover:text-white rounded-lg transition-all cursor-pointer"
                      >
                        {isPending ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                      </button>
                      <button
                        title="Batalkan"
                        disabled={isPending}
                        onClick={() => handleStatusChange(booking.id, "cancelled")}
                        className="p-1.5 bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all cursor-pointer"
                      >
                        {isPending ? <Loader2 size={15} className="animate-spin" /> : <X size={15} />}
                      </button>
                    </>
                  )}
                  {booking.status === "confirmed" && (
                    <>
                      <button
                        title="Selesaikan"
                        disabled={isPending}
                        onClick={() => handleStatusChange(booking.id, "completed")}
                        className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-lg transition-all cursor-pointer"
                      >
                        {isPending ? <Loader2 size={15} className="animate-spin" /> : <CheckSquare size={15} />}
                      </button>
                      <button
                        title="Batalkan"
                        disabled={isPending}
                        onClick={() => handleStatusChange(booking.id, "cancelled")}
                        className="p-1.5 bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all cursor-pointer"
                      >
                        {isPending ? <Loader2 size={15} className="animate-spin" /> : <X size={15} />}
                      </button>
                    </>
                  )}
                  {booking.status === "completed" && (
                    <span className="text-xs text-gray-500 italic px-2">Selesai</span>
                  )}
                  {booking.status === "cancelled" && (
                    <span className="text-xs text-red-500/70 italic px-2">Dibatalkan</span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
