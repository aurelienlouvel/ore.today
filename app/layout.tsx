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
  title: "oré ˖ ࣪⊹ product designer",
  description: "aurélien louvel's internet space",
  openGraph: {
    title: "oré ˖ ࣪⊹ product designer",
    description: "aurélien louvel's internet space",
    url: "https://ore.today",
    siteName: "oré ˖ ࣪⊹ product designer",
    images: [
      {
        url: "https://ore.today/og.png",
        width: 1040,
        height: 630,
        alt: "oré ˖ ࣪⊹ product designer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-title" content="oré ˖ ࣪⊹" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
