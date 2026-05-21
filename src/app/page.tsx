import { createClient } from "@/utils/supabase/server";
import MainClientWrapper from "@/components/MainClientWrapper";

export const revalidate = 0;

export default async function Home() {
  const supabase = await createClient();

  // 1. Fetch user & profile
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("role, full_name")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  // 2. Fetch contents (Hero and Business Info)
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

  // 3. Fetch services
  const { data: dbServices } = await supabase
    .from("services")
    .select("*")
    .order("created_at", { ascending: true });

  // 4. Fetch gallery
  const { data: dbGallery } = await supabase
    .from("gallery")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="flex min-h-screen flex-col bg-juragan-darker">
      <MainClientWrapper
        user={user}
        profile={profile}
        heroContent={heroContent}
        businessInfo={businessInfo}
        services={dbServices || []}
        gallery={dbGallery || []}
      />
    </main>
  );
}
