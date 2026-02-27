"use client";

import { WorkSpot } from "@/lib/types";

interface AmenitiesChecklistProps {
  spot: WorkSpot;
}

export default function AmenitiesChecklist({ spot }: AmenitiesChecklistProps) {
  const outlets = spot.logistics.outletDensity;
  const outletLabel = outlets === "plenty" ? "High" : outlets === "moderate" ? "Medium" : "Low";
  const outletColor = outlets === "plenty" ? "text-green-600" : outlets === "moderate" ? "text-yellow-600" : "text-red-500";

  // Determine purchase requirement from tags or other data
  const hasPurchaseRequirement = spot.vibe.tags.includes("coffee") || spot.vibe.tags.includes("food");
  
  // Cell signal estimation based on location type (simulated)
  const isIndoorMall = spot.vibe.tags.includes("mall") || spot.slug.includes("galleria");
  const cellSignal = isIndoorMall ? "LTE" : "5G";

  // Seating type
  const seatingTypes = spot.logistics.seatingType || [];
  const hasErgonomic = seatingTypes.includes("desk");
  const hasCommunal = seatingTypes.includes("communal");
  const hasStool = seatingTypes.includes("bar") || seatingTypes.includes("stool");

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200">
      <h3 className="font-semibold text-slate-900 mb-4">Amenities Checklist</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Outlets */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
          <span className="text-2xl">🔌</span>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide">Power Outlets</p>
            <p className={`font-semibold ${outletColor}`}>{outletLabel}</p>
          </div>
        </div>

        {/* Purchase Required */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
          <span className="text-2xl">☕</span>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide">Purchase</p>
            <p className="font-semibold text-slate-700">
              {hasPurchaseRequirement ? "Required" : "Not required"}
            </p>
          </div>
        </div>

        {/* Cell Signal */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
          <span className="text-2xl">📱</span>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide">Cell Signal</p>
            <p className={`font-semibold ${cellSignal === "5G" ? "text-green-600" : "text-yellow-600"}`}>
              {cellSignal}
            </p>
          </div>
        </div>

        {/* Seating */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
          <span className="text-2xl">🛋️</span>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide">Seating</p>
            <div className="flex gap-1 mt-0.5">
              {hasErgonomic && <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">Desk</span>}
              {hasCommunal && <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Table</span>}
              {hasStool && <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">Bar</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Tags */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="flex flex-wrap gap-2">
          {spot.openLate && (
            <span className="flex items-center gap-1 text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
              <span>🌙</span> Open Late
            </span>
          )}
          {spot.highSpeedWifi && (
            <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
              <span>⚡</span> High-Speed WiFi
            </span>
          )}
          {spot.logistics.noiseLevel <= 55 && (
            <span className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              <span>🤫</span> Quiet
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
