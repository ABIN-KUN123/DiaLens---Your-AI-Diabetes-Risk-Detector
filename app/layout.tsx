import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Atau sesuaikan dengan nama file CSS global Anda

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DiaLens AI",
  description: "The Clinical Curator for Diabetes Risk",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        {/* NAVBAR LAMA SUDAH DIHAPUS DARI SINI 
          Sehingga halaman login & register akan bersih otomatis tanpa ada menu yang bocor lagi.
        */}
        {children}
      </body>
    </html>
  );
}