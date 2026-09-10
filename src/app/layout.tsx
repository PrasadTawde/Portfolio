import type { Metadata } from "next";
import { Quicksand, Inter } from "next/font/google";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import "./globals.css";
import { PaletteProvider } from "@/context/PaletteContext";
import { BackgroundLayers } from "@/components/chrome/BackgroundLayers";
import { CustomCursor } from "@/components/chrome/CustomCursor";
import { Header } from "@/components/chrome/Header";
import { IntroLoader } from "@/components/chrome/IntroLoader";
import { PageTransition } from "@/components/chrome/PageTransition";
import { SITE } from "@/content/site";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const title = `${SITE.name} — ${SITE.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title,
  description: SITE.description,
  keywords: [SITE.name, SITE.role, "portfolio", "web developer", SITE.location],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE.url,
    title,
    description: SITE.description,
    siteName: SITE.name,
    images: [{ url: "/profile.png", width: 1280, height: 1229, alt: `Portrait of ${SITE.name}` }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: SITE.description,
    images: ["/profile.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

/** Person structured data (JSON-LD) — tells Google this page is specifically about {@link SITE.name} as a person, which is what makes a name search more likely to surface it. Static, developer-authored content only — never interpolate user input here. */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE.name,
  url: SITE.url,
  jobTitle: SITE.role,
  description: SITE.description,
  address: {
    "@type": "PostalAddress",
    addressLocality: SITE.location,
  },
  image: `${SITE.url}/profile.png`,
  sameAs: SITE.social.filter((s) => s.href !== "#").map((s) => s.href),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${quicksand.variable} ${inter.variable}`}>
      <body>
        {/* Static, developer-authored JSON only (never user input) — see personJsonLd above. */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
        <ReactLenis root options={{ anchors: true }} />
        <PaletteProvider>
          <BackgroundLayers />
          <CustomCursor />
          <PageTransition />
          <IntroLoader />
          <Header />
          {children}
        </PaletteProvider>
      </body>
    </html>
  );
}
