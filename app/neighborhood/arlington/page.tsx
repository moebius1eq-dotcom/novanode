import { Metadata } from "next";
import Link from "next/link";
import spotsData from "@/data/spots.json";
import { WorkSpot } from "@/lib/types";
import { NEIGHBORHOODS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Best Remote Work Spots in Arlington VA | Verified Wi-Fi (2026)",
  description: "15+ verified remote work spots in Arlington, VA. Real Wi-Fi speeds, outlet density, noise levels, and weekend policies. Updated February 2026.",
};

const ArlingtonSpots = (spotsData.spots as WorkSpot[])
  .filter(s => s.neighborhood === "arlington")
  .sort((a, b) => b.seo.rating - a.seo.rating);

export default function ArlingtonPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-b from-indigo-50 to-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-1 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full mb-4">
            📍 Arlington, VA
          </span>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Best Remote Work Spots in Arlington
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {ArlingtonSpots.length} verified spots with real Wi-Fi speeds, outlet density, and noise levels. 
            Updated {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.
          </p>
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

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {spot.highSpeedWifi && (
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                    ⚡ {spot.logistics.wifiSpeedDown} Mbps
                  </span>
                )}
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded">
                  🔌 {spot.logistics.outletDensity}
                </span>
                {spot.weekendFriendly && (
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded">
                    💻 Weekend OK
                  </span>
                )}
                {spot.powerPlayer && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                    🔋 Power
                  </span>
                )}
                {spot.isLibrary && (
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded">
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
  );
}
