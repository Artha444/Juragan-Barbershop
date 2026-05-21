"use server";

import { createClient, createAdminClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createBooking(data: {
  customerName: string;
  customerPhone: string;
  serviceId: string;
  bookingDate: string;
  bookingTime: string;
}) {
  const supabase = await createClient();

  // Try to get authenticated user if any (optional)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("bookings").insert({
    customer_id: user?.id || null,
    customer_name: data.customerName,
    customer_phone: data.customerPhone,
    service_id: data.serviceId,
    booking_date: data.bookingDate,
    booking_time: data.bookingTime,
    status: "pending",
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/dashboard");
  return { success: "Reservasi berhasil dibuat!" };
}

// Fetch occupied hours for a specific date so we can disable them!
// Uses admin client to bypass RLS since public guests need to load this but cannot select bookings.
export async function getOccupiedTimes(date: string) {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("booking_time")
    .eq("booking_date", date)
    .neq("status", "cancelled");

  if (error) {
    return [];
  }

  return data.map((b) => b.booking_time);
}
