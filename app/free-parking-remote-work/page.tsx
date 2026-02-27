import { Metadata } from "next";
import spotsData from "@/data/spots.json";
import { WorkSpot } from "@/lib/types";
import { NEIGHBORHOODS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Free Parking for Remote Workers in NoVA | Verified Spots | NoVaNode",
  description: "Free parking spots for remote workers in Northern Virginia. Libraries, malls, and cafes with no-parking-stress work zones.",
};

interface SpotWithParking extends WorkSpot {
  parkingInfo: string;
}

const ParkingSpots = (spotsData.spots as SpotWithParking[])
  .filter(s => s.parkingInfo?.toLowerCase().includes("free") || s.seo.priceRange === " $")
  .sort((a, b) => {
    // Libraries first (usually free)
    if (a.isLibrary && !b.isLibrary) return -1;
    if (!a.isLibrary && b.isLibrary) return 1;
    return b.logistics.wifiSpeedDown - a.logistics.wifiSpeedDown;
  });

export default function FreeParkingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-4">
            🅿️ Free Parking
          </span>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Remote Work Spots with Free Parking
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Parking in Arlington and Alexandria is a nightmare. This list features spots with 
            <strong> verified free parking</strong> — libraries, mall lobbies, and cafes with easy parking.
          </p>
        </div>
      </section>

      {/* Parking Tips */}
      <section className="py-6 px-4 bg-amber-50 border-b border-amber-100">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h3 className="font-semibold text-amber-800">Parking Pro Tips</h3>
              <ul className="text-sm text-amber-700 mt-1 space-y-1">
                <li>• <strong>Mall parking</strong> is usually free on weekdays after 10 AM</li>
                <li>• <strong>Libraries</strong> always have free parking lots</li>
                <li>• <strong>Arlington:</strong> Library garage on N Quincy St is free on weekends</li>
                <li>• <strong>Tysons:</strong> Tysons Corner Center garage is free for 2+ hours</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Parking Spots */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {ParkingSpots.map((spot) => (
            <div 
              key={spot.id}
              className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                {/* Parking Badge */}
                <div className="flex-shrink-0">
                  <div className={`w-20 h-20 rounded-xl flex flex-col items-center justify-center ${
                    spot.isLibrary ? "bg-blue-100" : "bg-green-100"
                  }`}>
                    <span className="text-2xl">{spot.isLibrary ? "📚" : "🅿️"}</span>
                    <span className="text-xs font-medium text-slate-700">
                      {spot.isLibrary ? "Library" : "Free Lot"}
                    </span>
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
                  
                  {/* Quick Stats */}
                  <div className="flex flex-wrap gap-3 mb-3">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                      ⚡ {spot.logistics.wifiSpeedDown} Mbps
                    </span>
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded">
                      🔌 {spot.logistics.outletDensity}
                    </span>
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded">
                      ⭐ {spot.seo.rating}
                    </span>
                    {spot.isLibrary && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                        📚 Study Rooms
                      </span>
                    )}
                  </div>

                  {/* Hours */}
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs font-medium text-slate-600 uppercase mb-1">Hours Today</p>
                    <div className="flex gap-4 text-sm">
                      <span className="text-slate-700">
                        {spot.hours[0]?.open && spot.hours[0]?.close 
                          ? `${spot.hours[0].open} - ${spot.hours[0].close}` 
                          : "Check schedule"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action */}
                <a
                  href={`/location/${spot.neighborhood}/${spot.slug}`}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Details →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* No Results */}
      {ParkingSpots.length === 0 && (
        <div className="py-12 px-4 text-center">
          <p className="text-slate-500">No free parking spots found.</p>
        </div>
      )}

      {/* CTA */}
      <section className="py-8 px-4 bg-white border-t border-slate-200">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-slate-600 mb-4">
            Know a spot with great free parking?
          </p>
          <a
            href="mailto:hello@novanode.dev?subject=Free%20Parking%20Spot"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span>📧</span>
            Suggest a Spot
          </a>
        </div>
      </section>
    </div>
  );
}
