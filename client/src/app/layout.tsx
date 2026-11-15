import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Mochamad Rizki | Junior Full Stack Developer",
    template: "%s | Mochamad Rizki",
  },
  description:
    "Portfolio Mochamad Rizki, Junior Full Stack Developer: profil, skill, pengalaman, dan project.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body
        className={`${inter.className} flex min-h-screen flex-col bg-white text-gray-900`}
      >
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
