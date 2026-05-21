"use server";

import { createClient, createAdminClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

// Helper to verify Cloudflare Turnstile token
async function verifyTurnstile(token: string, ip?: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    console.warn("Turnstile secret key is not configured. Bypassing captcha verification.");
    return true;
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token);
    if (ip) {
      formData.append("remoteip", ip);
    }

    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const outcome = await res.json();
    return !!outcome.success;
  } catch (err) {
    console.error("Turnstile verification error:", err);
    return false;
  }
}

export async function createBooking(data: {
  customerName: string;
  customerPhone: string;
  serviceId: string;
  bookingDate: string;
  bookingTime: string;
  includeKeramas?: boolean;
  turnstileToken?: string;
}) {
  const supabase = await createClient();

  // Get client IP address for Turnstile verification
  const clientHeaders = await headers();
  const clientIp = clientHeaders.get("x-forwarded-for")?.split(",")[0] || clientHeaders.get("x-real-ip") || undefined;

  // 1. Captcha Verification (if secret key is set)
  if (process.env.TURNSTILE_SECRET_KEY && !data.turnstileToken) {
    return { error: "Verifikasi captcha diperlukan." };
  }
  if (data.turnstileToken) {
    const isValidCaptcha = await verifyTurnstile(data.turnstileToken, clientIp);
    if (!isValidCaptcha) {
      return { error: "Verifikasi captcha gagal. Silakan coba lagi." };
    }
  }

  // 2. Double Booking Check (anti-bentrok)
  const { data: existingBooking } = await supabase
    .from("bookings")
    .select("id")
    .eq("booking_date", data.bookingDate)
    .eq("booking_time", data.bookingTime)
    .neq("status", "cancelled")
    .limit(1)
    .maybeSingle();

  if (existingBooking) {
    return { error: "Slot waktu ini sudah dipesan oleh orang lain. Silakan pilih waktu yang lain." };
  }

  // 3. Spam Cooldown (anti-spam bertubi-tubi: 2 menit)
  const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
  const { data: recentBooking } = await supabase
    .from("bookings")
    .select("id")
    .eq("customer_phone", data.customerPhone)
    .gt("created_at", twoMinutesAgo)
    .limit(1)
    .maybeSingle();

  if (recentBooking) {
    return { error: "Tolong tunggu 2 menit sebelum membuat reservasi baru untuk nomor HP yang sama." };
  }

  // 4. Daily Booking Limit (maksimal 2 reservasi aktif per hari per nomor HP)
  const { count } = await supabase
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .eq("customer_phone", data.customerPhone)
    .eq("booking_date", data.bookingDate)
    .neq("status", "cancelled");

  if (count && count >= 2) {
    return { error: "Nomor HP ini sudah mencapai batas maksimum (2 reservasi) untuk tanggal tersebut." };
  }

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
    include_keramas: data.includeKeramas ?? false,
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
