-- 1. Create tables

-- Profiles table to store custom user info
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
    full_name TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Contents table for static/dynamic web contents
CREATE TABLE IF NOT EXISTS public.contents (
    id TEXT PRIMARY KEY, -- 'hero', 'business_info'
    data JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Services table for haircuts & packages
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    price TEXT NOT NULL, -- e.g. "Rp 35.000" or numeric representation formatted as text
    features TEXT[] NOT NULL DEFAULT '{}',
    popular BOOLEAN DEFAULT false,
    special_badge TEXT, -- gold badge text, e.g. "Keramas + 5.000"
    discount_note TEXT, -- discount text, e.g. "Cashback 10%"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Gallery table for portfolio images
CREATE TABLE IF NOT EXISTS public.gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    title TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Bookings table for customer appointments
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    booking_date DATE NOT NULL,
    booking_time TEXT NOT NULL, -- e.g. "10:00"
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    include_keramas BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Trigger for public.profiles creation on auth.users sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, role, full_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'role', 'customer'),
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Row Level Security (RLS)

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Allow public read-access to profiles" ON public.profiles
    FOR SELECT TO public USING (true);

CREATE POLICY "Allow users to update their own profile" ON public.profiles
    FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Contents Policies
CREATE POLICY "Allow public read-access to contents" ON public.contents
    FOR SELECT TO public USING (true);

CREATE POLICY "Allow admin to manage contents" ON public.contents
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- Services Policies
CREATE POLICY "Allow public read-access to services" ON public.services
    FOR SELECT TO public USING (true);

CREATE POLICY "Allow admin to manage services" ON public.services
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- Gallery Policies
CREATE POLICY "Allow public read-access to gallery" ON public.gallery
    FOR SELECT TO public USING (true);

CREATE POLICY "Allow admin to manage gallery" ON public.gallery
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- Bookings Policies
CREATE POLICY "Allow admin to manage all bookings" ON public.bookings
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Allow public to insert bookings" ON public.bookings
    FOR INSERT TO public WITH CHECK (true);

-- Table to store daily opening and closing times
CREATE TABLE IF NOT EXISTS operational_hours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week int NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 6=Saturday
  open_time time NOT NULL,
  close_time time NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- 4. Insert initial values

-- Default Hero Content
INSERT INTO public.contents (id, data) VALUES (
    'hero',
    '{
        "title": "Tampil Maksimal dan Berkelas",
        "description": "Layanan pangkas rambut dan perawatan pria premium dengan kapster berpengalaman.",
        "bg_image": "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
    }'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Default Business Info Content
INSERT INTO public.contents (id, data) VALUES (
    'business_info',
    '{
        "whatsapp": "082229989429",
        "open_time": "10:00",
        "close_time": "22:00",
        "address": "Jl. Adi Sucipta, Pamoyanan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43212"
    }'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Default Services
INSERT INTO public.services (name, price, features, popular, special_badge, discount_note) VALUES 
('Juragan Haircut', 'Rp 35.000', ARRAY['Potong Rambut', 'Cuci Rambut', 'Pijat Ringan', 'Aplikasi Pomade'], true, NULL, NULL),
('Paket Juragan', 'Rp 75.000', ARRAY['Cukur', 'Hot towel', 'Keramas', 'Hair tonic', 'Styling', 'Face mask', 'Blackhead', 'Head massage', 'Free drink'], false, 'Keramas + 5.000', 'Diskon 10% Cashback untuk member juragan/barbershop'),
('Perming + Free Cukur', 'Rp 200.000', ARRAY['Cuci Rambut', 'Hair Vitamin', 'Styling Pomade/Clay', 'Hair Tonic'], false, NULL, NULL)
ON CONFLICT DO NOTHING;

-- Default Gallery Images
INSERT INTO public.gallery (image_url, title) VALUES
('https://images.unsplash.com/photo-1622286342621-4bd786c2447c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Fade Haircut'),
('https://images.unsplash.com/photo-1599351431202-1e0f0137899a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Pompadour'),
('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Beard Trim'),
('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Classic Cut'),
('https://images.unsplash.com/photo-1593702275687-f8b402bf1fb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Undercut'),
('https://images.unsplash.com/photo-1512496015851-a1cbfc37cb71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Styling')
ON CONFLICT DO NOTHING;
