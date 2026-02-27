import { Metadata } from "next";
import spotsData from "@/data/spots.json";
import { WorkSpot } from "@/lib/types";
import { NEIGHBORHOODS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Laptop-Friendly Weekend Spots in NoVA | Verified | NoVaNode",
  description: "Can you work at Tatte on Saturday? Many NoVA cafes have weekend laptop bans. Find verified laptop-friendly spots open on weekends.",
};

const WeekendFriendlySpots = (spotsData.spots as WorkSpot[])
  .filter(s => s.weekendFriendly)
  .sort((a, b) => b.logistics.wifiSpeedDown - a.logistics.wifiSpeedDown);

export default function LaptopFriendlyWeekendsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-b from-amber-50 to-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-1 bg-amber-100 text-amber-700 text-sm font-medium rounded-full mb-4">
            💻 Weekend Work
          </span>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Laptop-Friendly Weekends in NoVA
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            ⚠️ Many Arlington & Alexandria cafes (like Tatte) now ban laptops on weekends. 
            This list shows spots where you can <strong>actually work</strong> on Saturdays and Sundays.
          </p>
        </div>
      </section>

      {/* Warning Banner */}
      <section className="py-6 px-4 bg-red-50 border-b border-red-100">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="font-semibold text-red-800">Weekend Laptop Ban Trend</h3>
              <p className="text-sm text-red-700">
                Several NoVA cafes have implemented "No Laptop" policies on weekends after 11 AM. 
                Always check the laptop policy before heading out, or stick to the verified spots below.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Weekend Spots */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {WeekendFriendlySpots.map((spot) => (
            <div 
              key={spot.id}
              className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                {/* Weekend Badge */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-xl bg-green-100 flex flex-col items-center justify-center">
                    <span className="text-2xl">✅</span>
                    <span className="text-xs font-medium text-green-700">Weekend OK</span>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg text-slate-900">{spot.name}</h3>
                    <span className="text-xs text-slate-500">
                      {NEIGHBORHOODS[spot.neighborhood]}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mb-3">{spot.address}</p>
                  
                  {/* Weekend Hours */}
                  <div className="mb-3 p-3 bg-green-50 rounded-lg">
                    <p className="text-xs font-medium text-green-800 uppercase mb-1">Weekend Hours</p>
                    {spot.hours.filter(h => h.day === "Saturday" || h.day === "Sunday").map(h => (
                      <p key={h.day} className="text-sm text-green-700">
                        {h.day}: {h.open && h.close ? `${h.open} - ${h.close}` : "Closed"}
                      </p>
                    ))}
                  </div>

                  {/* Policy */}
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs font-medium text-slate-600 uppercase mb-1">Laptop Policy</p>
                    <p className="text-sm text-slate-700">{spot.laptopPolicy || "Laptops welcome"}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex flex-col gap-2 text-center">
                  <div className="px-3 py-2 bg-indigo-50 rounded-lg">
                    <p className="text-lg font-bold text-indigo-600">{spot.logistics.wifiSpeedDown}</p>
                    <p className="text-xs text-indigo-500">Mbps WiFi</p>
                  </div>
                  <div className="px-3 py-2 bg-slate-50 rounded-lg">
                    <p className="text-sm font-medium text-slate-600">{spot.logistics.outletDensity}</p>
                    <p className="text-xs text-slate-400">outlets</p>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
                <a
                  href={`/location/${spot.neighborhood}/${spot.slug}`}
                  className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  View Details →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tips */}
      <section className="py-8 px-4 bg-white border-t border-slate-200">
        <div className="max-w-2xl mx-auto">
          <h3 className="font-semibold text-slate-900 mb-4 text-center">💡 Weekend Work Tips</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>• <strong>Libraries</strong> are always laptop-friendly on weekends</li>
            <li>• <strong>Coworking spaces</strong> like 3DEN have no restrictions</li>
            <li>• <strong>Arlington Public Library</strong> has study rooms you can book</li>
            <li>• <strong>Arrive early</strong> (9 AM) to claim the best spots</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
