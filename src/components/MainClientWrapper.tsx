"use client";

import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhyChooseUs from "@/components/WhyChooseUs";
import Services from "@/components/Services";
import Gallery from "@/components/Gallery";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";

interface Service {
  id: string;
  name: string;
  price: string;
  features: string[];
  popular: boolean;
  special_badge?: string | null;
  discount_note?: string | null;
}

interface GalleryItem {
  id: string;
  image_url: string;
  title: string;
}

interface MainClientWrapperProps {
  user: User | null;
  profile: { role: string; full_name: string | null } | null;
  heroContent: {
    title: string;
    description: string;
    bg_image: string;
  };
  businessInfo: {
    whatsapp: string;
    open_time: string;
    close_time: string;
    address: string;
  };
  services: Service[];
  gallery: GalleryItem[];
}

export default function MainClientWrapper({
  user,
  profile,
  heroContent,
  businessInfo,
  services,
  gallery,
}: MainClientWrapperProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <>
      <Navbar currentUser={user} userRole={profile?.role} />
      <Hero
        heroData={heroContent}
        onBookingClick={() => setIsBookingOpen(true)}
      />
      <WhyChooseUs />
      <Services servicesData={services} />
      <Gallery galleryData={gallery} />
      <Contact contactData={businessInfo} />
      <Footer />

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        services={services}
        currentUser={user}
        businessWhatsapp={businessInfo.whatsapp}
      />
    </>
  );
}
