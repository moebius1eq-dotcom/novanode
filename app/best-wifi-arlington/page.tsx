import { Metadata } from "next";
import Link from "next/link";
import spotsData from "@/data/spots.json";
import { WorkSpot } from "@/lib/types";

export const metadata: Metadata = {
  title: "Best Wi-Fi in Arlington VA | Remote Work Spots | NoVaNode",
  description: "Arlington's fastest verified Wi-Fi spots for remote work. Rankings, reviews, and logistics data. Updated February 2026.",
};

export default function BestWifiArlington() {
  const spots = (spotsData.spots as WorkSpot[])
    .filter(s => s.neighborhood === "arlington")
    .sort((a, b) => b.logistics.wifiSpeedDown - a.logistics.wifiSpeedDown);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-indigo-600 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <a href="/" className="text-indigo-200 hover:text-white mb-4 inline-block">← Back</a>
          <h1 className="text-3xl font-bold">⚡ Best Wi-Fi in Arlington</h1>
          <p className="text-indigo-100 mt-2">Verified speedtest results for remote work</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        {spots.map((spot, idx) => (
          <Link key={spot.id} href={`/location/${spot.neighborhood}/${spot.slug}`}
            className="block bg-white p-4 rounded-lg border border-slate-200 hover:border-indigo-300">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-lg font-semibold">{idx + 1}. {spot.name}</span>
                <p className="text-sm text-slate-500">{spot.seo.description}</p>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-indigo-600">{spot.logistics.wifiSpeedDown} Mbps</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
