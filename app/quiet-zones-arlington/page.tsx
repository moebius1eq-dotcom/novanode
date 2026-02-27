import { Metadata } from "next";
import spotsData from "@/data/spots.json";
import { WorkSpot } from "@/lib/types";
import { NEIGHBORHOODS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Quiet Study Spots in Arlington | Library-Quiet Remote Work | NoVaNode",
  description: "Silent study spots and quiet work zones in Arlington, VA. Libraries, coworking spaces, and cafes with 40dB or less noise. Perfect for deep focus work.",
};

const QuietSpots = (spotsData.spots as WorkSpot[])
  .filter(s => s.neighborhood === "arlington" && s.logistics.noiseLevel <= 55)
  .sort((a, b) => a.logistics.noiseLevel - b.logistics.noiseLevel);

export default function QuietZonesArlingtonPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-1 bg-slate-200 text-slate-700 text-sm font-medium rounded-full mb-4">
            🔇 Library Quiet
          </span>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Quiet Zones in Arlington
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Need silence for deep work? These Arlington spots have verified noise levels of 55dB or less. 
            Library-quiet environments forfocused remote work.
          </p>
        </div>
      </section>

      {/* Noise Legend */}
      <section className="py-6 px-4 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span className="text-slate-600">Quiet (30-40dB)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
              <span className="text-slate-600">Moderate (40-55dB)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
              <span className="text-slate-600">Lively (55-65dB)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              <span className="text-slate-600">Social (65dB+)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quiet Spots */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {QuietSpots.map((spot) => (
            <div 
              key={spot.id}
              className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Noise Level */}
                <div className="flex-shrink-0">
                  <div className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center ${
                    spot.logistics.noiseLevel <= 40 ? "bg-green-100" :
                    spot.logistics.noiseLevel <= 55 ? "bg-yellow-100" :
                    "bg-orange-100"
                  }`}>
                    <span className={`text-xl font-bold ${
                      spot.logistics.noiseLevel <= 40 ? "text-green-700" :
                      spot.logistics.noiseLevel <= 55 ? "text-yellow-700" :
                      "text-orange-700"
                    }`}>
                      {spot.logistics.noiseLevel}
                    </span>
                    <span className="text-xs text-slate-500">dB</span>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-lg text-slate-900">{spot.name}</h3>
                    {spot.isLibrary && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                        📚 Library
                      </span>
                    )}
                    {spot.hasZoomPods && (
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                        🎧 Zoom Pods
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500">{spot.address}</p>
                  
                  {/* Quick Stats */}
                  <div className="flex flex-wrap gap-4 mt-3 text-sm">
                    <span className="text-slate-600">
                      ⚡ {spot.logistics.wifiSpeedDown} Mbps
                    </span>
                    <span className="text-slate-600">
                      🔌 {spot.logistics.outletDensity}
                    </span>
                    <span className="text-slate-600">
                      ⭐ {spot.seo.rating}/5 ({spot.seo.reviewCount} reviews)
                    </span>
                  </div>
                </div>

                {/* Action */}
                <a
                  href={`/location/${spot.neighborhood}/${spot.slug}`}
                  className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
                >
                  View Details
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Empty State */}
      {QuietSpots.length === 0 && (
        <div className="py-12 px-4 text-center">
          <p className="text-slate-500">No quiet spots found in Arlington yet.</p>
        </div>
      )}

      {/* CTA */}
      <section className="py-8 px-4 bg-white border-t border-slate-200">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-slate-600 mb-4">
            Know a quiet spot we missed?
          </p>
          <a
            href="mailto:hello@novanode.dev?subject=Quiet%20Spot%20Suggestion"
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
