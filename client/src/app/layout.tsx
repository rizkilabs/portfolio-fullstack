import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
      <body className={`${inter.className} bg-white text-gray-900`}>
        {children}
      </body>
    </html>
  );
}
