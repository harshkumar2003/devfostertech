import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Work from "@/components/Work";
import About from "@/components/About";
import Why from "@/components/Why";
import Contact from "@/components/Contact";

const SITE_URL = "https://www.devfostertech.com";

export const metadata = {
  title: "Web Development, SEO & Branding Services | Dev Foster Tech",
  description:
    "Dev Foster Tech helps businesses grow with high-performance websites, SEO strategy, and social media branding. Work with a practical team focused on measurable growth.",
  keywords: [
    "web development services",
    "SEO agency",
    "social media branding",
    "business website development",
    "digital growth services",
    "Dev Foster Tech",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Web Development, SEO & Branding Services | Dev Foster Tech",
    description:
      "Build a stronger digital presence with website development, SEO, and branding services tailored for growth-focused businesses.",
    url: SITE_URL,
    siteName: "Dev Foster Tech",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Dev Foster Tech Services",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Web Development, SEO & Branding Services | Dev Foster Tech",
    description:
      "Build a stronger digital presence with website development, SEO, and branding services tailored for growth-focused businesses.",
    images: [`${SITE_URL}/og-image.png`],
  },
};

export default function Home() {
  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Dev Foster Tech",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/blog?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Dev Foster Tech",
    url: SITE_URL,
    serviceType: ["Website Development", "SEO Services", "Social Media Branding"],
    areaServed: "Worldwide",
    description:
      "Dev Foster Tech provides web development, SEO, and branding services that help businesses grow online.",
    sameAs: ["https://www.instagram.com/devfostertech"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <Hero />
      <Services />
      <Work />
      <About />
      <Why />
      <Contact />
    </>
  );
}
