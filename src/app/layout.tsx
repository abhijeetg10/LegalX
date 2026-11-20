import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL("https://legalex.in"),
  title: {
    default: `${siteConfig.name} | Trusted Legal Counsel Since 2009 | Adv. Amit S. Rathi`,
    template: `%s | ${siteConfig.name} Chambers & Advocates`,
  },
  description: `LEGALEX is an authoritative law firm in Maharashtra established in 2009, led by Founder Adv. Amit S. Rathi (Sanad No. 5803-2008). Practicing across Civil & Family, Revenue, Consumer, Criminal, and MACT litigation.`,
  keywords: [
    "Legalex",
    "Advocate Amit S Rathi",
    "Law Firm Pune",
    "Maharashtra Revenue Tribunal Lawyer",
    "Civil Lawyer Maharashtra",
    "Consumer Court Advocate Pune",
    "Criminal Defence Lawyer Bombay High Court",
    "MACT Claim Advocate",
    "7/12 Land Mutation Lawyer Pune",
  ],
  authors: [{ name: "Adv. Amit S. Rathi", url: "https://legalex.in" }],
  creator: "Adv. Amit S. Rathi",
  publisher: "LEGALEX Chambers",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  openGraph: {
    title: `${siteConfig.name} | Trusted Legal Counsel Since 2009`,
    description: `Litigation advocacy, dispute resolution, and verifiable legal management across Maharashtra courts. Led by Adv. Amit S. Rathi.`,
    url: "https://legalex.in",
    siteName: siteConfig.name,
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1200",
        width: 1200,
        height: 630,
        alt: "LEGALEX Chambers & Advocates",
      },
    ],
  },
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: siteConfig.name,
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1200",
    "@id": "https://legalex.in",
    url: "https://legalex.in",
    telephone: siteConfig.contact.phone,
    priceRange: "₹₹₹",
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.contact.address.street,
      addressLocality: siteConfig.contact.address.city,
      postalCode: siteConfig.contact.address.pinCode,
      addressRegion: siteConfig.contact.address.state,
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 18.5314,
      longitude: 73.8553,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:30",
        closes: "19:30",
      },
    ],
    founder: {
      "@type": "Person",
      name: siteConfig.founder.name,
      jobTitle: "Founder, Director & CGO",
      identifier: "Sanad No. 5803-2008",
    },
  };

  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#F8F6F1] text-[#1F2937] antialiased selection:bg-[#C9A24B] selection:text-white">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
