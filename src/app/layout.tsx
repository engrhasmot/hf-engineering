import type { Metadata } from "next";
import { Inter, Montserrat, Hind_Siliguri } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";
import { getSiteUrl } from "@/lib/constants";
import "./globals.css";

// Body font
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Headings font
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

// Bengali font
const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind",
  weight: ["400", "500", "600", "700"],
  subsets: ["bengali"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "HF Design & Engineering Solutions | পরিকল্পিত নকশা, নিরাপদ নির্মাণ",
    template: "%s | HF Design & Engineering Solutions",
  },
  description:
    "Building design, 3D elevation, structural drawing, BOQ and plan approval in Savar, Dhaka.",
  keywords: [
    "HF Design & Engineering Solutions",
    "HF Engineering",
    "civil engineering Bangladesh",
    "architectural design Savar",
    "structural drafting Dhaka",
    "BOQ estimation",
    "plan passing",
    "site supervision",
    "Bangladesh",
    "2D plans",
    "3D design",
    "construction",
    "3D rendering",
    "RAJUK plan approval",
    "plan approval Bangladesh",
    "structural design Bangladesh",
    "cost estimator",
    "construction cost estimator",
    "residential building design",
    "commercial building design",
  ],
  authors: [{ name: "HF Design & Engineering Solutions" }],
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "HF Design & Engineering Solutions",
    description:
      "পরিকল্পিত নকশা, নিরাপদ নির্মাণ — Building design, 3D elevation, structural drawing, BOQ and plan approval in Savar, Dhaka.",
    type: "website",
    locale: "en_BD",
    siteName: "HF Design & Engineering Solutions",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "HF Design & Engineering Solutions logo" }],
  },
};

import { LanguageProvider } from "@/context/LanguageContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bn"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${montserrat.variable} ${hindSiliguri.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <Toaster richColors position="top-right" />
          <Script id="jsonld-organization" type="application/ld+json" strategy="afterInteractive">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "HF Design & Engineering Solutions",
              alternateName: "HF",
              description: "Building design, 3D elevation, structural drawing, BOQ and plan approval in Savar, Dhaka.",
              url: getSiteUrl(),
              logo: `${getSiteUrl()}/images/logo.png`,
              email: "info@hfengineeringbd.com",
              telephone: "+880-1631-186218",
              address: {
                "@type": "PostalAddress",
                streetAddress: "আয়শা মঞ্জিল, বাড়ি ১৪/০৫, ওয়ার্ড নং ১, নয়াবাড়ি",
                addressLocality: "সাভার রেডিও কলোনি, ঢাকা",
                addressCountry: "BD",
              },
              sameAs: [
                `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "8801631186218"}`,
                "https://www.facebook.com/profile.php?id=61592186641331",
              ],
              knowsAbout: [
                "Civil Engineering",
                "Architectural Design",
                "Structural Drafting",
                "3D Rendering",
                "BOQ Estimation",
                "Plan Passing",
                "Construction Supervision",
              ],
            })}
          </Script>
      </body>
    </html>
  );
}
