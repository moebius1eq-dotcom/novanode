"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { WorkSpot } from "@/lib/types";
import { NEIGHBORHOODS } from "@/lib/constants";
import VibeIndicator from "./VibeIndicator";
import { trackMonetizationEvent } from "@/lib/analytics";

interface LocationCardProps {
  spot: WorkSpot;
  showCompare?: boolean;
  featuredLabel?: string;
}

function outletSignal(outlet: string) {
  if (outlet === "plenty") return { text: "High", cls: "bg-green-600 text-white" };
  if (outlet === "moderate") return { text: "Mid", cls: "bg-amber-500 text-white" };
  return { text: "Low", cls: "bg-red-600 text-white" };
}

export default function LocationCard({ spot, showCompare = false, featuredLabel }: LocationCardProps) {
  const [isSelectedForCompare, setIsSelectedForCompare] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("compareSpots");
    if (stored) {
      const ids = JSON.parse(stored);
      setIsSelectedForCompare(ids.includes(spot.id));
    }
  }, [spot.id]);

  const handleCompareToggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const stored = localStorage.getItem("compareSpots");
    let ids: string[] = stored ? JSON.parse(stored) : [];

    if (ids.includes(spot.id)) ids = ids.filter((id) => id !== spot.id);
    else if (ids.length < 4) ids = [...ids, spot.id];

    localStorage.setItem("compareSpots", JSON.stringify(ids));
    setIsSelectedForCompare(ids.includes(spot.id));
    window.dispatchEvent(new CustomEvent("compareChange", { detail: { ids } }));
  }, [spot.id]);

  const wifiCls = spot.logistics.wifiSpeedDown >= 100 ? "bg-green-600 text-white" : "bg-red-600 text-white";
  const parkingFree = (spot.parkingStatus === "free-garage") || (spot.parkingInfo?.toLowerCase().includes("free") ?? false);
  const parkingCls = parkingFree ? "bg-green-600 text-white" : "bg-red-600 text-white";
  const outlet = outletSignal(spot.logistics.outletDensity);

  return (
    <Link
      href={`/location/${spot.neighborhood}/${spot.slug}`}
      className="group relative rounded-xl border border-slate-200 bg-white hover:shadow-md transition-all"
      onClick={() => {
        if (featuredLabel) {
          trackMonetizationEvent({
            type: "featured_spot_click",
            spotId: spot.id,
            spotSlug: spot.slug,
            neighborhood: spot.neighborhood,
            meta: { featuredLabel },
          });
        }
      }}
    >
      {showCompare && (
        <button
          onClick={handleCompareToggle}
          className={`absolute top-3 left-3 z-10 p-2 rounded-lg border-2 ${isSelectedForCompare ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white border-slate-300 text-slate-500"}`}
          title={isSelectedForCompare ? "Remove" : "Add"}
        >
          ⚖️
        </button>
      )}

      <div className="h-40 bg-slate-100 rounded-t-xl relative overflow-hidden flex items-center justify-center">
        <span className="text-5xl">☕</span>
        <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
          {featuredLabel ? <span className="px-2 py-1 rounded bg-amber-500 text-white text-[10px] font-semibold uppercase">{featuredLabel}</span> : null}
          <VibeIndicator vibe={spot.vibe.primary} size="sm" />
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase">{NEIGHBORHOODS[spot.neighborhood]}</span>
          <span className="text-xs text-slate-500">★ {spot.seo.rating}</span>
        </div>

        <h3 className="font-semibold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors mb-3">{spot.name}</h3>

        <div className="grid grid-cols-3 gap-2">
          <div className={`rounded-lg px-2 py-2 text-center ${wifiCls}`}>
            <p className="text-[10px] font-bold uppercase">📶</p>
            <p className="text-sm font-bold">{spot.logistics.wifiSpeedDown}</p>
          </div>
          <div className={`rounded-lg px-2 py-2 text-center ${outlet.cls}`}>
            <p className="text-[10px] font-bold uppercase">🔌</p>
            <p className="text-sm font-bold">{outlet.text}</p>
          </div>
          <div className={`rounded-lg px-2 py-2 text-center ${parkingCls}`}>
            <p className="text-[10px] font-bold uppercase">🚗</p>
            <p className="text-sm font-bold">{parkingFree ? "Free" : "Paid"}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 text-[11px] text-slate-500">
          <span>Verified {spot.logistics.lastVerified}</span>
          <span>{spot.seo.reviewCount} users</span>
        </div>
      </div>
    </Link>
  );
}
