import { Metadata } from "next";
import spotsData from "@/data/spots.json";
import { WorkSpot } from "@/lib/types";
import { NEIGHBORHOODS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Best Wi-Fi in Tysons | Verified Fast Speeds | NoVaNode",
  description: "Fastest Wi-Fi spots in Tysons, VA. Verified speeds up to 500 Mbps. Perfect for business travelers and remote workers needing reliable internet.",
};

const TysonsSpots = (spotsData.spots as WorkSpot[])
  .filter(s => s.neighborhood === "tysons")
  .sort((a, b) => b.logistics.wifiSpeedDown - a.logistics.wifiSpeedDown);

export default function BestWifiTysonsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-b from-indigo-50 to-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-1 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full mb-4">
            ⚡ Fastest Wi-Fi
          </span>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Best Wi-Fi in Tysons
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Verified high-speed internet for business travelers and remote workers. 
            Speeds tested on {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.
          </p>
        </div>
      </section>

      {/* Speed Ranking */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {TysonsSpots.map((spot, idx) => (
              <div 
                key={spot.id}
                className={`p-6 flex flex-col md:flex-row md:items-center gap-4 ${
                  idx !== TysonsSpots.length - 1 ? "border-b border-slate-100" : ""
                }`}
              >
                {/* Rank */}
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                    idx === 0 ? "bg-yellow-100 text-yellow-700" :
                    idx === 1 ? "bg-slate-100 text-slate-600" :
                    idx === 2 ? "bg-amber-100 text-amber-700" :
                    "bg-slate-50 text-slate-400"
                  }`}>
                    {idx + 1}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-lg text-slate-900">{spot.name}</h3>
                    {spot.highSpeedWifi && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        High-Speed
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500">{spot.address}</p>
                </div>

                {/* Speed Stats */}
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-indigo-600">{spot.logistics.wifiSpeedDown}</p>
                    <p className="text-xs text-slate-500">Mbps ↓</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-slate-600">{spot.logistics.wifiSpeedUp}</p>
                    <p className="text-xs text-slate-500">Mbps ↑</p>
                  </div>
                </div>

                {/* Actions */}
                <a
                  href={`/location/${spot.neighborhood}/${spot.slug}`}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  View Details
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="py-8 px-4 bg-white border-t border-slate-200">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-slate-600 text-sm">
            💡 <strong>Pro tip:</strong> 3DEN Tysons offers day passes ({'$'}35) for fiber-speed WiFi if you need guaranteed bandwidth for important calls.
          </p>
        </div>
      </section>
    </div>
  );
}
