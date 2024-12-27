 import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://adamasmacaoyunu.com"),
  title: "Adam Asmaca Oyunu | Online Türkçe Kelime Tahmin Oyunu",
  description:
    "Arkadaşlarınızla online adam asmaca oynayın! Türkçe kelimelerle eğlenceli vakit geçirin. Ücretsiz, kayıt gerektirmez, hemen oynamaya başlayın!",
  keywords:
    "adam asmaca, adam asmaca oyunu, online adam asmaca, kelime tahmin oyunu, türkçe kelime oyunu",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://adamasmacaoyunu.com",
    title: "Adam Asmaca Oyunu | Online Türkçe Kelime Tahmin Oyunu",
    description:
      "Arkadaşlarınızla online adam asmaca oynayın! Türkçe kelimelerle eğlenceli vakit geçirin.",
    siteName: "Adam Asmaca Oyunu",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Adam Asmaca Oyunu",
              "url": "https://adamasmacaoyunu.com",
              "description": "Online Türkçe kelime tahmin oyunu",
              "applicationCategory": "Game",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "TRY"
              },
              "inLanguage": "tr-TR"
            })
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
