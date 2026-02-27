import { Metadata } from "next";
import Link from "next/link";
import spotsData from "@/data/spots.json";
import { WorkSpot } from "@/lib/types";
import { NEIGHBORHOODS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Quiet Work Zones in NoVA | Under 65dB | NoVaNode",
  description: "Library-quiet spots for deep work in Northern Virginia. Filter by decibel rating and find your focus zone. Updated February 2026.",
};

export default function QuietZonesPage() {
  const spots = (spotsData.spots as WorkSpot[])
    .filter(s => s.logistics.noiseLevel <= 65)
    .sort((a, b) => a.logistics.noiseLevel - b.logistics.noiseLevel);

  const getNoiseColor = (dB: number) => {
    if (dB <= 45) return "text-green-600 bg-green-50 border-green-200";
    if (dB <= 55) return "text-blue-600 bg-blue-50 border-blue-200";
    if (dB <= 65) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getNoiseLabel = (dB: number) => {
    if (dB <= 45) return "Library Quiet";
    if (dB <= 55) return "Quiet";
    if (dB <= 65) return "Moderate";
    return "Loud";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-blue-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-4">
            <a href="/" className="inline-flex items-center gap-2 text-blue-200 hover:text-white transition-colors">
              ← Back to NoVaNode
            </a>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            🔇 Quiet Work Zones
          </h1>
          <p className="text-lg md:text-xl text-blue-100">
            Library-quiet spots for deep focus. Under 65dB verified.
          </p>
          <p className="mt-4 text-blue-200 text-sm">
            Real decibel readings. Not "quiet" as in "not too loud."
          </p>
        </div>
      </div>

      {/* Info Bar */}
      <div className="bg-slate-100 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-3 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span className="font-medium">Library Quiet</span>
            <span className="text-slate-500">≤45dB</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            <span className="font-medium">Quiet</span>
            <span className="text-slate-500">≤55dB</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span className="font-medium">Moderate</span>
            <span className="text-slate-500">≤65dB</span>
          </div>
        </div>
      </div>

      {/* Spots */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-4">
          {spots.map((spot) => (
            <Link
              key={spot.id}
              href={`/location/${spot.neighborhood}/${spot.slug}`}
              className="block bg-white rounded-xl p-6 border border-slate-200 transition-all hover:shadow-lg hover:border-blue-300"
            >
              <div className="flex items-center gap-4">
                {/* Noise Level */}
                <div className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center border-2 ${getNoiseColor(spot.logistics.noiseLevel)}`}>
                  <span className="text-2xl font-bold">{spot.logistics.noiseLevel}</span>
                  <span className="text-xs">dB</span>
                </div>
                
                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900">{spot.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${getNoiseColor(spot.logistics.noiseLevel)}`}>
                      {getNoiseLabel(spot.logistics.noiseLevel)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">{NEIGHBORHOODS[spot.neighborhood]}</p>
                </div>
                
                {/* Vibe */}
                <div className="text-right">
                  <div className="text-sm font-medium text-slate-700">
                    {spot.vibe.primary === "quiet" ? "🔇" : spot.vibe.primary === "focus" ? "🎯" : "☕"}
                  </div>
                  <p className="text-xs text-slate-500 capitalize">{spot.vibe.primary}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}