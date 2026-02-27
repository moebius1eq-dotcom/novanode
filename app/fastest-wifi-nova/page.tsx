import { Metadata } from "next";
import Link from "next/link";
import spotsData from "@/data/spots.json";
import { WorkSpot } from "@/lib/types";
import { NEIGHBORHOODS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Fastest Wi-Fi in NoVA | Verified Speedtest Results | NoVaNode",
  description: "Ranking of the fastest verified Wi-Fi speeds in Northern Virginia. Get work done with 100Mbps+ verified connections. Updated February 2026.",
};

export default function FastestWifiPage() {
  const spots = (spotsData.spots as WorkSpot[])
    .filter(s => s.logistics.wifiSpeedDown >= 50)
    .sort((a, b) => b.logistics.wifiSpeedDown - a.logistics.wifiSpeedDown);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-indigo-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-4">
            <a href="/" className="inline-flex items-center gap-2 text-indigo-200 hover:text-white transition-colors">
              ← Back to NoVaNode
            </a>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            ⚡ Fastest Wi-Fi in NoVA
          </h1>
          <p className="text-lg md:text-xl text-indigo-100">
            Verified speedtest results. Updated February 2026.
          </p>
          <p className="mt-4 text-indigo-200 text-sm">
            Real speedtests. Not marketing claims.
          </p>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-4">
          {spots.map((spot, idx) => {
            const rank = idx + 1;
            const isTop3 = rank <= 3;
            
            return (
              <Link
                key={spot.id}
                href={`/location/${spot.neighborhood}/${spot.slug}`}
                className={`block bg-white rounded-xl p-6 border transition-all hover:shadow-lg ${
                  isTop3 
                    ? "border-indigo-200 shadow-md" 
                    : "border-slate-200 hover:border-indigo-300"
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                    rank === 1 ? "bg-yellow-100 text-yellow-700" :
                    rank === 2 ? "bg-slate-200 text-slate-700" :
                    rank === 3 ? "bg-orange-100 text-orange-700" :
                    "bg-slate-100 text-slate-500"
                  }`}>
                    {rank}
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900">{spot.name}</h3>
                      {spot.highSpeedWifi && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                          Verified 100Mbps+
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500">{NEIGHBORHOODS[spot.neighborhood]}</p>
                  </div>
                  
                  {/* Speed */}
                  <div className="text-right">
                    <div className="text-2xl font-bold text-indigo-600">
                      {spot.logistics.wifiSpeedDown} <span className="text-sm font-normal">Mbps</span>
                    </div>
                    <div className="text-xs text-slate-500">
                      ↓ {spot.logistics.wifiSpeedDown} / ↑ {spot.logistics.wifiSpeedUp}
                    </div>
                  </div>
                </div>
                
                {/* Verification Badge */}
                <div className="mt-3 flex items-center gap-2 text-xs text-green-600">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Verified {new Date(spot.logistics.verifiedAt).toLocaleDateString()}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}