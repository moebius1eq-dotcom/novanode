"use client";

import { WorkSpot } from "@/lib/types";
import LocationCard from "./LocationCard";

interface LocationGridProps {
  spots: WorkSpot[];
  emptyMessage?: string;
}

export default function LocationGrid({ spots, emptyMessage = "No work spots found." }: LocationGridProps) {
  if (spots.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🔍</div>
        <p className="text-slate-500 text-lg">{emptyMessage}</p>
        <p className="text-slate-400 text-sm mt-2">Try adjusting your filters or search query.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {spots.map((spot) => (
        <LocationCard key={spot.id} spot={spot} />
      ))}
    </div>
  );
}
