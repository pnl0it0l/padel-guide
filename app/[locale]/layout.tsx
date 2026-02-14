import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "@/i18n";
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return {
    applicationName: "Padel Guide",
    title: "Padel Guide · Your complete padel guide",
    description:
      "The best padel guide. Find FPP rankings, book courts on Playtomic, watch training on YouTube, join tournaments and community. Everything in one place.",
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
      title: "Padel Guide · Your complete padel guide",
      description:
        "FPP rankings, Playtomic bookings, YouTube training, tournaments and community. Everything about padel in one place.",
      type: "website",
      locale: locale === "pt" ? "pt_PT" : locale === "en" ? "en_US" : "fr_FR",
      url: "https://padelguide.pt",
      siteName: "Padel Guide",
    },
    twitter: {
      card: "summary_large_image",
      title: "Padel Guide · Your complete padel guide",
      description:
        "FPP rankings, Playtomic bookings, YouTube training, tournaments and padel community.",
    },
    alternates: {
      canonical: "https://padelguide.pt",
      languages: {
        pt: "/pt",
        en: "/en",
        fr: "/fr",
      },
    },
    metadataBase: new URL("https://padelguide.pt"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6219557724010826"
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
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>{children}</AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
