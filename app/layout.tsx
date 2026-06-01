'use client';
import { Inter } from "next/font/google";
import "./globals.css";
import { usePathname } from 'next/navigation';
import Navbar from "@/components/navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  // Sembunyikan Navbar & Footer di:
  // - /dashboard/* (dashboard user & admin)
  // - /restaurants (daftar restoran)
  // TAMPILKAN Navbar di /restaurant/[id] (detail restoran)
  const hideNavbarFooter = pathname?.startsWith('/dashboard') || 
                           pathname?.startsWith('/restaurants');

  return (
    <html lang="id">
      <body className={inter.className}>
        {!hideNavbarFooter && <Navbar />}
        {children}
        {!hideNavbarFooter && <Footer />}
      </body>
    </html>
  );
}