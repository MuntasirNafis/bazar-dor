import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PriceTicker from "@/components/PriceTicker";
import "./globals.css";

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "বাজার দর | BazarDor",
  description: "বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের সঠিক ও রিয়েল-টাইম বাজার দর।",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" data-theme="light">
      <body className={`${hindSiliguri.className} antialiased bg-base-100 text-base-content min-h-screen flex flex-col`}>
        <Navbar />
        <PriceTicker />
        <main className="flex-grow">{children}</main>
        <Footer />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}