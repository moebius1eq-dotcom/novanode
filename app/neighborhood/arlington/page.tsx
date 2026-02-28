import { Metadata } from "next";
import Link from "next/link";
import spotsData from "@/data/spots.json";
import { WorkSpot } from "@/lib/types";
import { NEIGHBORHOODS } from "@/lib/constants";
import { generateLocalBusinessSchema, POWER_SPOTS } from "@/data/locations";

export const metadata: Metadata = {
  title: "15 Best Remote Work Spots in Arlington with Verified Wi-Fi (2026)",
  description: "Discover the best remote work spots in Arlington, VA. Verified Wi-Fi speeds, outlet density, and local parking tips for Clarendon vs Ballston.",
};

const ArlingtonSpots = (spotsData.spots as WorkSpot[])
  .filter(s => s.neighborhood === "arlington")
  .sort((a, b) => b.seo.rating - a.seo.rating);

// JSON-LD for SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Best Remote Work Spots in Arlington VA",
  description: "15+ verified remote work spots in Arlington with real Wi-Fi speeds and outlet density.",
  url: "https://novanode.dev/neighborhood/arlington",
  mainEntity: {
    "@type": "ItemList",
    itemListElement: ArlingtonSpots.map((spot, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "LocalBusiness",
        name: spot.name,
        address: {
          "@type": "PostalAddress",
          streetAddress: spot.address,
          addressLocality: "Arlington",
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

export default function ArlingtonPage() {
  return (
    <>
      {/* JSON-LD Schema for Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-slate-50">
        {/* Hero */}
        <section className="bg-gradient-to-b from-indigo-50 to-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-1 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full mb-4">
              📍 Arlington, VA
            </span>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              15 Best Remote Work Spots in Arlington with Verified Wi-Fi (2026)
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {ArlingtonSpots.length} verified spots with real Wi-Fi speeds, outlet density, and noise levels. 
              Updated February 2026.
            </p>
          </div>
        </section>

        {/* Local's Guide - Arlington Specific */}
        <section className="py-8 px-4 bg-amber-50 border-y border-amber-200">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 border border-amber-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span>🗺️</span> Local's Guide: Parking in Arlington
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-indigo-700 mb-2">Clarendon</h3>
                  <p className="text-sm text-slate-600">
                    <strong>Best for:</strong> Morning focus sessions before the lunch rush. 
                    Street parking is metered (free after 7pm). The Wilson Blvd corridor has 
                    several coffee shops with "Power Player" status—outlets at every seat. 
                    <strong> Pro tip:</strong> Park in the Clarendon Metro garage ($2.50/hr) 
                    and walk to any spot within 5 minutes.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-indigo-700 mb-2">Ballston</h3>
                  <p className="text-sm text-slate-600">
                    <strong>Best for:</strong> All-day sessions and rainy day work. 
                    The Ballston Quarter underground parking is $3/hr with validation. 
                    <strong> Pro tip:</strong> Northside Social is walkable from Ballston-MGM 
                    Metro, but check the weekend laptop policy—upstairs bans laptops after 11am 
                    on Sat/Sun.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="py-8 px-4 bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-6 text-center">
            <div>
              <p className="text-2xl font-bold text-indigo-600">{ArlingtonSpots.length}</p>
              <p className="text-sm text-slate-500">Spots</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{ArlingtonSpots.filter(s => s.highSpeedWifi).length}</p>
              <p className="text-sm text-slate-500">High-Speed WiFi</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{ArlingtonSpots.filter(s => s.weekendFriendly).length}</p>
              <p className="text-sm text-slate-500">Weekend Friendly</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{ArlingtonSpots.filter(s => s.powerPlayer).length}</p>
              <p className="text-sm text-slate-500">Power Players</p>
            </div>
          </div>
        </section>

        {/* Filter Links */}
        <section className="py-6 px-4 bg-slate-100 border-b border-slate-200">
          <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-3">
            <Link href="/quiet-zones-arlington" className="px-3 py-1.5 bg-white text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors">
              🔇 Quiet Zones
            </Link>
            <Link href="/laptop-friendly-weekends" className="px-3 py-1.5 bg-white text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors">
              💻 Weekend Friendly
            </Link>
            <Link href="/best-wifi-arlington" className="px-3 py-1.5 bg-white text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors">
              ⚡ Fastest WiFi
            </Link>
          </div>
        </section>

        {/* Spots Grid */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {ArlingtonSpots.map((spot) => (
              <Link
                key={spot.id}
                href={`/location/${spot.neighborhood}/${spot.slug}`}
                className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-md transition-all group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {spot.name}
                    </h3>
                    <p className="text-sm text-slate-500">{spot.address}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-yellow-500">★</span>
                    <span className="font-medium">{spot.seo.rating}</span>
                  </div>
                </div>

                {/* Zero-Click Pills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {spot.highSpeedWifi && (
                    <span className="px-2.5 py-1 bg-green-600 text-white text-xs font-bold rounded-full flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                      </svg>
                      {spot.logistics.wifiSpeedDown} Mbps
                    </span>
                  )}
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                    spot.logistics.outletDensity === "plenty" 
                      ? "bg-blue-600 text-white" 
                      : "bg-slate-500 text-white"
                  }`}>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {spot.logistics.outletDensity}
                  </span>
                  {spot.weekendFriendly && (
                    <span className="px-2.5 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">
                      💻 Weekend OK
                    </span>
                  )}
                  {spot.powerPlayer && (
                    <span className="px-2.5 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full">
                      🔋 Power
                    </span>
                  )}
                  {spot.isLibrary && (
                    <span className="px-2.5 py-1 bg-purple-600 text-white text-xs font-bold rounded-full">
                      📚 Library
                    </span>
                  )}
                </div>

                {/* Expert Tip */}
                {spot.expertTip && (
                  <p className="text-sm text-slate-600 line-clamp-2">
                    💡 {spot.expertTip}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-8 px-4 bg-white border-t border-slate-200">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-slate-600 mb-4">
              Know an Arlington spot we missed?
            </p>
            <a
              href="mailto:hello@novanode.dev?subject=Arlington%20Spot%20Suggestion"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <span>📧</span>
              Suggest a Spot
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
