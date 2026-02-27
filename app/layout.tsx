import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "NoVaNode | Remote Work Spots in Northern Virginia",
  description: "Discover the best remote work locations in Northern Virginia. Verified Wi-Fi speeds, outlet density, noise levels, and seating types. Find your perfect work spot.",
  keywords: ["remote work", "coworking", "Northern Virginia", "NoVa", "wifi", "coffee shop", " Arlington", "Alexandria", "Tysons", "Reston"],
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
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
