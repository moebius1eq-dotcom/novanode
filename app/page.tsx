import { Metadata } from "next";
import spotsData from "@/data/spots.json";
import { WorkSpot } from "@/lib/types";
import SearchBar from "@/components/SearchBar";
import HomeExplore from "@/components/HomeExplore";
import HomeSecondarySections from "@/components/HomeSecondarySections";
import { filterVerifiedSpots } from "@/lib/verified";

export const metadata: Metadata = {
  title: "NoVaNode | Remote Work Spots in Northern Virginia",
  description: "Discover the best remote work locations in Northern Virginia. Verified Wi-Fi speeds, outlet density, noise levels, and seating types. Find your perfect work spot.",
};

const spots = filterVerifiedSpots(spotsData.spots as WorkSpot[]);

// JSON-LD Schema for homepage
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "NoVaNode",
  description: "Remote work spots in Northern Virginia with verified Wi-Fi speeds",
  url: "https://novanode.pages.dev",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://novanode.pages.dev/?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
  mainEntity: {
    "@type": "ItemList",
    itemListElement: spots.slice(0, 10).map((spot, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "LocalBusiness",
        name: spot.name,
        address: {
          "@type": "PostalAddress",
          streetAddress: spot.address,
          addressLocality: spot.neighborhood,
          addressRegion: "VA",
          addressCountry: "US",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: spot.seo.rating,
          reviewCount: spot.seo.reviewCount,
          bestRating: 5,
        },
      },
    })),
  },
};

export default function HomePage() {
  const highSpeedSpots = spots.filter(s => s.highSpeedWifi);
  const lateSpots = spots.filter(s => s.openLate);

  return (
    <>
      {/* JSON-LD for Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#F9FAFB] py-14 px-4 border-b border-[#E5E7EB]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-7">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">Where are you working today?</h1>
            <p className="text-sm text-slate-500">Pick fast WiFi. Pick open seats. Go.</p>
          </div>
          <SearchBar />
          <div className="flex flex-wrap justify-center gap-3 mt-5 text-xs">
            <span className="px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700">{spots.length} Verified Spots</span>
            <span className="px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700">{highSpeedSpots.length} Fast WiFi</span>
            <span className="px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700">{lateSpots.length} Open Late</span>
          </div>
        </div>
      </section>

      {/* Explore Spots (List + Map Toggle) */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <HomeExplore spots={spots} />
        </div>
      </section>

      <HomeSecondarySections spots={spots} />
    </div>
    </>
  );
}
