import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { siteUrl } from "@/lib/site";
import ThemeSync from "@/components/ThemeSync";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

const title = "M. Rizki | Full Stack Developer";
const description =
  "Portfolio M. Rizki, Full Stack Developer: profil, skill, pengalaman, dan project dengan React, Next.js, Node.js, dan PostgreSQL.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | M. Rizki",
  },
  description,
  keywords: [
    "Full Stack Developer",
    "Web Developer",
    "React",
    "Next.js",
    "Node.js",
    "PostgreSQL",
    "Portfolio",
  ],
  authors: [{ name: "M. Rizki" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    siteName: "M. Rizki",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <noscript>
          <style>
            {`
              .reveal {
                opacity: 1 !important;
                transform: none !important;
              }
            `}
          </style>
        </noscript>
      </head>

      <body className={`${inter.className} bg-surfacetext-gray-900`}>
        <Suspense fallback={null}>
          <ThemeSync />
        </Suspense>{" "}
        {children}
      </body>
    </html>
  );
}
