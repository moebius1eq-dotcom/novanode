import { Metadata } from "next";
import Link from "next/link";
import spotsData from "@/data/spots.json";
import { WorkSpot, Neighborhood } from "@/lib/types";
import { NEIGHBORHOODS } from "@/lib/constants";
import SearchBar from "@/components/SearchBar";
import HomeExplore from "@/components/HomeExplore";
import NewsletterSignup from "@/components/NewsletterSignup";
import NeighborhoodPushSubscribe from "@/components/NeighborhoodPushSubscribe";

export const metadata: Metadata = {
  title: "NoVaNode | Remote Work Spots in Northern Virginia",
  description: "Discover the best remote work locations in Northern Virginia. Verified Wi-Fi speeds, outlet density, noise levels, and seating types. Find your perfect work spot.",
};

const spots = spotsData.spots as WorkSpot[];

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
      <section className="bg-gradient-to-b from-indigo-50 to-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Find Your Perfect<br />
              <span className="text-indigo-600">Remote Work Spot</span> in NoVa
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Verified Wi-Fi speeds, outlet density, noise levels, and seating types. 
              Real data for real remote workers.
            </p>
          </div>

          {/* Search Bar */}
          <SearchBar />

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📍</span>
              <span><strong className="text-slate-900">{spots.length}</strong> spots verified</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <span><strong className="text-slate-900">{highSpeedSpots.length}</strong> high-speed Wi-Fi</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌙</span>
              <span><strong className="text-slate-900">{lateSpots.length}</strong> open late</span>
            </div>
            <a href="/virginia-laptop-policies" className="flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors">
              <span>💻</span>
              <span><strong>Laptop Policies</strong></span>
            </a>
            <a href="/free-alternatives" className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
              <span>💰</span>
              <span><strong>Free Spots</strong></span>
            </a>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <a href="/?highSpeed=true" className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
              ⚡ High-Speed WiFi
            </a>
            <a href="/?openLate=true" className="px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors">
              🌙 Open Now
            </a>
            <a href="/free-parking-remote-work" className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
              🅿️ Free Parking
            </a>
            <a href="/laptop-friendly-weekends" className="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors">
              💻 Weekend Friendly
            </a>
          </div>
        </div>
      </section>

      {/* Explore Spots (List + Map Toggle) */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <HomeExplore spots={spots} />
        </div>
      </section>

      {/* Retention Modules */}
      <section className="py-12 px-4 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
          <NeighborhoodPushSubscribe />
          <NewsletterSignup />
        </div>
      </section>

      {/* Neighborhood Quick Links */}
      <section className="py-12 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
            Explore by Neighborhood
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(NEIGHBORHOODS).map(([slug, name]) => {
              const count = spots.filter(s => s.neighborhood === slug).length;
              return (
                <Link
                  key={slug}
                  href={`/neighborhood/${slug}`}
                  className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md transition-all text-center"
                >
                  <span className="text-3xl mb-2 block">
                    {slug === 'arlington' ? '🏙️' : slug === 'alexandria' ? '🏛️' : slug === 'tysons' ? '🛍️' : '🌳'}
                  </span>
                  <h3 className="font-semibold text-slate-900">{name}</h3>
                  <p className="text-sm text-slate-500">{count} spots</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
