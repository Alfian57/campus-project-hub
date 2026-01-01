import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Script from "next/script";
import { AuthProvider } from "@/components/providers/AuthContext";

import { ConfigurationProvider } from "@/components/providers/configuration-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://campushub.id";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Campus Project Hub - Platform Showcase Proyek Mahasiswa Indonesia",
    template: "%s | Campus Project Hub",
  },
  description:
    "Platform terbesar untuk mahasiswa Indonesia memamerkan proyek inovatif, menerima feedback berkualitas, dan mendapat dukungan finansial dari komunitas. Bergabung dengan ribuan mahasiswa berbakat!",
  keywords: [
    "proyek mahasiswa",
    "showcase proyek",
    "portofolio mahasiswa",
    "campus hub",
    "proyek kampus",
    "teknologi mahasiswa",
    "startup mahasiswa",
    "karya mahasiswa",
    "inovasi kampus",
    "coding project",
    "web development",
    "mobile app",
    "machine learning",
    "Indonesia",
  ],
  authors: [{ name: "Campus Project Hub Team" }],
  creator: "Campus Project Hub",
  publisher: "Campus Project Hub",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    siteName: "Campus Project Hub",
    title: "Campus Project Hub - Platform Showcase Proyek Mahasiswa Indonesia",
    description:
      "Platform terbesar untuk mahasiswa Indonesia memamerkan proyek inovatif, menerima feedback berkualitas, dan mendapat dukungan finansial dari komunitas.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Campus Project Hub - Tempat Kreativitas Mahasiswa Bersinar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Campus Project Hub - Platform Showcase Proyek Mahasiswa Indonesia",
    description:
      "Platform terbesar untuk mahasiswa Indonesia memamerkan proyek inovatif dan mendapat dukungan dari komunitas.",
    images: ["/og-image.png"],
    creator: "@campushub_id",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const midtransClientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
  const midtransUrl = process.env.MIDTRANS_IS_PRODUCTION === "true"
    ? "https://app.midtrans.com/snap/snap.js"
    : "https://app.sandbox.midtrans.com/snap/snap.js";

  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <head>
        {midtransClientKey && (
          <Script
            src={midtransUrl}
            data-client-key={midtransClientKey}
            strategy="afterInteractive"
          />
        )}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.__ENV__ = {
                NEXT_PUBLIC_API_URL: "${process.env["NEXT_PUBLIC_API_URL"] || "http://localhost:8000/api/v1"}",
              };
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConfigurationProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ConfigurationProvider>
        <Toaster />
      </body>
    </html>
  );
}
