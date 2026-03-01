import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PWARegister from "@/components/PWARegister";
import AmplitudeInit from "@/components/AmplitudeInit";
import StickyFilterBar from "@/components/StickyFilterBar";

export const metadata: Metadata = {
  metadataBase: new URL("https://novanode.pages.dev"),
  title: "NoVaNode | Remote Work Spots in Northern Virginia",
  description: "Discover the best remote work locations in Northern Virginia. Verified Wi-Fi speeds, outlet density, noise levels, and seating types. Find your perfect work spot.",
  keywords: ["remote work", "coworking", "Northern Virginia", "NoVa", "wifi", "coffee shop", " Arlington", "Alexandria", "Tysons", "Reston"],
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "NoVaNode | Remote Work Spots in Northern Virginia",
    description: "Discover verified remote work locations in NoVa with real Wi-Fi speeds, noise levels, and seating info.",
    type: "website",
    locale: "en_US",
    siteName: "NoVaNode",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <meta name="google-site-verification" content="wewHqQ-K0vV4dp9rPN28BRmdnj1wbtVD7fI4mAS3ENs" />
      <body className="min-h-screen flex flex-col">
        <PWARegister />
        <AmplitudeInit />
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <StickyFilterBar />
      </body>
    </html>
  );
}