// app/layout.js
import Navbar from "@/components/Navbar";
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Dev Foster Tech",
  description:
    "Dev Foster Tech — Empowering businesses through modern websites, branding, and SEO services.",
  keywords: [
    "Dev Foster Tech",
    "website development",
    "SEO services",
    "digital branding",
    "Next.js developer",
    "React developer",
    "tech company",
    "web agency",
  ],
  authors: [{ name: "Harsh Kumar", url: "https://devfostertech.com" }],
  creator: "Harsh Kumar",
  publisher: "Dev Foster Tech",
  applicationName: "Dev Foster Tech",
  generator: "Next.js",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Dev Foster Tech",
    description:
      "Crafting digital excellence — from sleek websites to smart branding and SEO.",
    url: "https://devfostertech.com",
    siteName: "Dev Foster Tech",
    images: [
      {
        url: "https://devfostertech.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Dev Foster Tech Banner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dev Foster Tech",
    description:
      "Crafting digital excellence — from sleek websites to smart branding and SEO.",
    // creator: "@your_twitter_handle",
    images: ["https://devfostertech.com/og-image.png"],
  },
  metadataBase: new URL("https://devfostertech.com"),
  alternates: {
    canonical: "https://devfostertech.com",
  },
  // viewport: "width=device-width, initial-scale=1",
  // themeColor: "#000000",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* The JSON-LD script is now a direct child of <html> */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Dev Foster Tech",
            url: "https://devfostertech.com",
            logo: {
              "@type": "ImageObject",
              url: "https://devfostertech.com/logo.svg",
            },
            sameAs: ["https://www.instagram.com/devfostertech"],
          }),
        }}
      />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black scroll-smooth`}
      >
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>

        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8923506649802677"
     crossorigin="anonymous"></script>
    </html>
  );
}
