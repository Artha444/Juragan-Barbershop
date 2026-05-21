import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Juragan Barbershop",
  description: "Tampil Maksimal dan Berkelas di Juragan Barbershop. Layanan pangkas rambut dan perawatan pria premium.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body
        className={`${inter.variable} ${montserrat.variable} font-sans bg-black text-white antialiased min-h-screen flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}
