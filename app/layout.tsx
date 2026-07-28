import type { Metadata } from "next";
import { Rubik_Glitch, Special_Elite, VT323 } from "next/font/google";
import "./globals.css";

const rubikGlitch = Rubik_Glitch({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-glitch",
  display: "swap",
});

const specialElite = Special_Elite({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-special-elite",
  display: "swap",
});

const vt323 = VT323({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-vt323",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://alif-fadillah-portfolio.vercel.app"),
  title: {
    default: "Alif Fadillah Ummar - Junior Software Engineer",
    template: "%s | Alif Fadillah Ummar",
  },
  alternates: {
    canonical: "https://alif-fadillah-portfolio.vercel.app",
    languages: {
      "id": "https://alif-fadillah-portfolio.vercel.app/id",
      "en": "https://alif-fadillah-portfolio.vercel.app/en",
    },
  },
  icons: {
    icon: "/logo/logo.png",
  },
  description: "Fresh Graduate S1 Informatika Unsika.",
  openGraph: {
    title: "Alif Fadillah Ummar - Junior Software Engineer",
    description: "Deskripsi singkat untuk sosial media.",
    url: "https://alif-fadillah-portfolio.vercel.app",
    siteName: "Alif Fadillah Ummar Portfolio",
    locale: "id_ID",
    type: "website",
  },
};

import { Toaster } from "@/components/Toaster";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      className={`${rubikGlitch.variable} ${specialElite.variable} ${vt323.variable} scroll-smooth`}
    >
      <body className="bg-brutal-white antialiased text-brutal-black">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
