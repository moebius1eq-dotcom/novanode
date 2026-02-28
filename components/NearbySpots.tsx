"use client";

import Link from "next/link";
import { SeedLocation } from "@/data/locations";

interface NearbySpotsProps {
  currentSlug: string;
  neighborhood: string;
  spots: SeedLocation[];
}

export default function NearbySpots({ currentSlug, neighborhood, spots }: NearbySpotsProps) {
  const nearbySpots = spots
    .filter(spot => spot.neighborhood === neighborhood && spot.slug !== currentSlug)
    .slice(0, 3);

  if (nearbySpots.length === 0) return null;

  return (
    <div className="mt-12 pt-8 border-t border-slate-200">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Nearby Spots in {neighborhood}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {nearbySpots.map((spot) => (
          <Link
            key={spot.id}
            href={`/location/${spot.neighborhood}/${spot.slug}`}
            className="bg-slate-50 rounded-lg p-4 hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-slate-900">{spot.name}</h4>
              <span className="text-sm text-slate-500">⭐ {spot.rating}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-600">
              <span className="flex items-center gap-1">
                <span className="text-indigo-600">📶</span>
                {spot.wifiSpeed} Mbps
              </span>
              <span className="flex items-center gap-1">
                <span className="text-slate-400">🔌</span>
                {spot.outlets}/10
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}