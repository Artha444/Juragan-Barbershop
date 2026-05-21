import { createClient } from "@/utils/supabase/server";
import ContentForm from "@/components/admin/ContentForm";

export const revalidate = 0;

export default async function AdminContent() {
  const supabase = await createClient();

  // Fetch Hero and Business Info contents
  const { data: contents } = await supabase.from("contents").select("*");

  const heroContent = contents?.find((c) => c.id === "hero")?.data || {
    title: "Tampil Maksimal dan Berkelas",
    description: "Layanan pangkas rambut dan perawatan pria premium dengan kapster berpengalaman.",
    bg_image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
  };

  const businessInfo = contents?.find((c) => c.id === "business_info")?.data || {
    whatsapp: "082229989429",
    open_time: "10:00",
    close_time: "22:00",
    address: "Jl. Adi Sucipta, Pamoyanan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43212",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-white tracking-wider">
          KELOLA KONTEN & INFORMASI
        </h1>
        <p className="text-gray-400 mt-1">
          Sesuaikan teks landing page, unggah latar belakang banner, dan perbarui info operasional barbershop.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ContentForm
          heroData={heroContent}
          businessData={businessInfo}
        />
      </div>
    </div>
  );
}
