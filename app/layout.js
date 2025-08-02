// app/layout.js
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";

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
  authors: [{ name: "Harsh Kumar", url: "https://devfoster.tech" }],
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
    url: "https://devfoster.tech",
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
  metadataBase: new URL("https://devfoster.tech"),
  alternates: {
    canonical: "https://devfoster.tech",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#000000",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Optional: Add structured data via JSON-LD here if needed */}
        {/* <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Dev Foster Tech",
              url: "https://devfoster.tech",
              logo: "https://devfoster.tech/logo.png",
              sameAs: [
                // "https://linkedin.com/company/devfoster",
                "https://www.instagram.com/devfostertech",
              ],
            }),
          }}
        /> */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black scroll-smooth`}
      >
        {children}
      </body>
    </html>
  );
}
