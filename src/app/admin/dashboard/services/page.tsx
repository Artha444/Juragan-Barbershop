import { createClient } from "@/utils/supabase/server";
import ServicesManagement from "@/components/admin/ServicesManagement";

export const revalidate = 0;

export default async function AdminServices() {
  const supabase = await createClient();

  // Fetch services list
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .order("created_at", { ascending: true });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-white tracking-wider">
          KELOLA LAYANAN & HARGA
        </h1>
        <p className="text-gray-400 mt-1">
          Tambah, edit, atau hapus paket potongan rambut dan treatment perawatan pria.
        </p>
      </div>

      <ServicesManagement initialServices={services || []} />
    </div>
  );
}
