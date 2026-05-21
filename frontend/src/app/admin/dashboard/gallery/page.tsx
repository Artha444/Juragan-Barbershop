import { createClient } from "@/utils/supabase/server";
import GalleryManagement from "@/components/admin/GalleryManagement";

export const revalidate = 0;

export default async function AdminGallery() {
  const supabase = await createClient();

  // Fetch gallery list
  const { data: galleryItems } = await supabase
    .from("gallery")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-white tracking-wider">
          KELOLA PORTFOLIO GALERI
        </h1>
        <p className="text-gray-400 mt-1">
          Unggah foto hasil potongan terbaik kapster Anda dan hapus foto lama.
        </p>
      </div>

      <GalleryManagement initialGallery={galleryItems || []} />
    </div>
  );
}
