import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import AuthProvider from "@/components/AuthProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  applicationName: "Padel Guide",
  title: "Padel Guide · O teu guia de padel em Portugal",
  description:
    "O melhor guia de padel em Portugal. Encontra rankings FPP, reserva courts no Playtomic, vê treinos no YouTube, junta-te a torneios e comunidade. Tudo num só lugar.",
  keywords: [
    "padel",
    "Portugal",
    "padel Portugal",
    "FPP",
    "Federação Portuguesa Padel",
    "rankings padel",
    "torneios padel",
    "Playtomic",
    "reservar court padel",
    "treino padel",
    "padel YouTube",
    "comunidade padel",
    "Robot Padel",
    "Smash4Fun",
    "calendário torneios padel",
    "World Padel Tour",
    "guia padel",
  ],
  authors: [{ name: "Padel Guide" }],
  creator: "Padel Guide",
  publisher: "Padel Guide",
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
  openGraph: {
    title: "Padel Guide · O teu guia de padel em Portugal",
    description:
      "Rankings FPP, reservas Playtomic, treinos YouTube, torneios e comunidade. Tudo sobre padel em Portugal num só lugar.",
    type: "website",
    locale: "pt_PT",
    url: "https://padelguide.pt",
    siteName: "Padel Guide",
  },
  twitter: {
    card: "summary_large_image",
    title: "Padel Guide · O teu guia de padel em Portugal",
    description:
      "Rankings FPP, reservas Playtomic, treinos YouTube, torneios e comunidade padel em Portugal.",
  },
  alternates: {
    canonical: "https://padelguide.pt",
  },
  metadataBase: new URL("https://padelguide.pt"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-E1GGNKMK8E"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-E1GGNKMK8E');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
