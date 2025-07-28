import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const neueMontreal = localFont({
  src: "../public/fonts/PPNeueMontreal-Variable.ttf",
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
      <body className={`${neueMontreal.className} `}>{children}</body>
    </html>
  );
}
