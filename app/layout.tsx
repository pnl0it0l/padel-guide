import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Padel Guide · O teu guia de padel em Portugal",
  description:
    "Links úteis, curados e organizados para jogadores de padel. Equipamento, treino, apps, comunidade e mais.",
  keywords: [
    "padel",
    "Portugal",
    "raquetes",
    "treino",
    "padel Portugal",
    "equipamento padel",
    "aulas padel",
  ],
  openGraph: {
    title: "Padel Guide · O teu guia de padel em Portugal",
    description: "Links úteis, curados e organizados para jogadores de padel.",
    type: "website",
    locale: "pt_PT",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
