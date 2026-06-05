import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import JsonLd from "@/components/JsonLd";
import { portfolioJsonLd, siteDescription, siteTitle, siteUrl } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s | Temesgen Mamo"
  },
  description: siteDescription,
  applicationName: "Temesgen Mamo Portfolio",
  authors: [{ name: "Temesgen Mamo", url: siteUrl }],
  creator: "Temesgen Mamo",
  publisher: "Temesgen Mamo",
  alternates: {
    canonical: siteUrl
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    siteName: "Temesgen Mamo Portfolio",
    images: [
      {
        url: "/assets/projetsolaire-desktop.png",
        width: 1200,
        height: 630,
        alt: "Temesgen Mamo product design and Rive animation portfolio"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/assets/projetsolaire-desktop.png"]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <JsonLd data={portfolioJsonLd()} />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
