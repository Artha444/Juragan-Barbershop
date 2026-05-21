"use server";

import { createClient, createAdminClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// 1. Booking actions
export async function updateBookingStatus(bookingId: string, status: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", bookingId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/dashboard");
  return { success: true };
}

// 2. Content actions (Hero & Business Info)
export async function updateContent(id: string, data: any) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("contents")
    .upsert({ id, data, updated_at: new Date().toISOString() });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/dashboard/content");
  return { success: true };
}

// 3. Storage image uploader
export async function uploadImage(formData: FormData, folder: string = "general") {
  const supabase = await createClient();
  const file = formData.get("file") as File;

  if (!file || file.size === 0) {
    return { error: "File tidak valid." };
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${folder}/${Date.now()}.${fileExt}`;
  const fileBuffer = await file.arrayBuffer();

  const { data, error } = await supabase.storage
    .from("barbershop-assets")
    .upload(fileName, fileBuffer, {
      contentType: file.type,
      upsert: true,
    });

  if (error) {
    return { error: error.message };
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from("barbershop-assets")
    .getPublicUrl(fileName);

  return { publicUrl };
}

// 4. Service/Package CRUD
export async function saveService(data: {
  id?: string;
  name: string;
  price: string;
  features: string[];
  popular: boolean;
  special_badge?: string | null;
  discount_note?: string | null;
}) {
  const supabase = await createClient();

  const servicePayload = {
    name: data.name,
    price: data.price,
    features: data.features,
    popular: data.popular,
    special_badge: data.special_badge || null,
    discount_note: data.discount_note || null,
  };

  let error;
  if (data.id) {
    // Update
    const res = await supabase
      .from("services")
      .update(servicePayload)
      .eq("id", data.id);
    error = res.error;
  } else {
    // Create
    const res = await supabase.from("services").insert(servicePayload);
    error = res.error;
  }

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/dashboard/services");
  return { success: true };
}

export async function deleteService(serviceId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("services").delete().eq("id", serviceId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/dashboard/services");
  return { success: true };
}

// 5. Gallery CRUD
export async function addGalleryItem(title: string, imageUrl: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("gallery")
    .insert({ title, image_url: imageUrl });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/dashboard/gallery");
  return { success: true };
}

export async function deleteGalleryItem(id: string, imagePath?: string) {
  const supabase = await createClient();

  // Delete from DB
  const { error } = await supabase.from("gallery").delete().eq("id", id);
  if (error) {
    return { error: error.message };
  }

  // Optional: Delete from Storage if storage path is provided
  if (imagePath) {
    await supabase.storage.from("barbershop-assets").remove([imagePath]);
  }

  revalidatePath("/");
  revalidatePath("/admin/dashboard/gallery");
  return { success: true };
}
