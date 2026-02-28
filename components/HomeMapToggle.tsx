"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import { WorkSpot } from "@/lib/types";
import { NEIGHBORHOODS } from "@/lib/constants";
import LocationCard from "@/components/LocationCard";
import SponsoredDisclosure from "@/components/SponsoredDisclosure";
import { isFeaturedSpot } from "@/lib/monetization";

interface HomeMapToggleProps {
  spots: WorkSpot[];
}

const neighborhoodCenter: Record<string, [number, number]> = {
  arlington: [38.8816, -77.0910],
  alexandria: [38.8048, -77.0469],
  tysons: [38.9187, -77.2311],
  reston: [38.9586, -77.3570],
};

function hashOffset(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash << 5) - hash + slug.charCodeAt(i);
    hash |= 0;
  }
  const lat = ((hash % 1000) / 1000) * 0.03 - 0.015;
  const lng = (((hash >> 8) % 1000) / 1000) * 0.03 - 0.015;
  return [lat, lng] as const;
}

function MapResizeFix({ trigger }: { trigger: string }) {
  const map = useMap();

  useEffect(() => {
    const id = setTimeout(() => map.invalidateSize(), 150);
    return () => clearTimeout(id);
  }, [map, trigger]);

  return null;
}

export default function HomeMapToggle({ spots }: HomeMapToggleProps) {
  const [view, setView] = useState<"list" | "map">("list");

  const withCoords = useMemo(
    () =>
      spots.map((spot) => {
        const center = neighborhoodCenter[spot.neighborhood] ?? [38.90, -77.20];
        const [latOff, lngOff] = hashOffset(spot.slug);
        return {
          spot,
          lat: center[0] + latOff,
          lng: center[1] + lngOff,
        };
      }),
    [spots],
  );

  const listSpots = useMemo(
    () => [...spots].sort((a, b) => Number(isFeaturedSpot(b)) - Number(isFeaturedSpot(a))),
    [spots],
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold text-slate-900">All Locations</h2>
        <div className="inline-flex bg-slate-100 rounded-lg p-1">
          <button
            onClick={() => setView("list")}
            className={`px-3 py-1.5 text-sm rounded-md ${view === "list" ? "bg-white shadow text-slate-900" : "text-slate-600"}`}
          >
            List View
          </button>
          <button
            onClick={() => setView("map")}
            className={`px-3 py-1.5 text-sm rounded-md ${view === "map" ? "bg-white shadow text-slate-900" : "text-slate-600"}`}
          >
            Map View
          </button>
        </div>
      </div>

      {view === "list" ? (
        <>
          <p className="text-slate-500 mb-3">{spots.length} spots • Pre-rendered for instant loading</p>
          {listSpots.some((spot) => isFeaturedSpot(spot)) ? (
            <div className="mb-4">
              <SponsoredDisclosure variant="card" />
            </div>
          ) : null}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listSpots.map((spot) => (
              <LocationCard
                key={spot.id}
                spot={spot}
                featuredLabel={isFeaturedSpot(spot) ? "Featured" : undefined}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-3">
          <div className="text-sm text-slate-600 space-y-1">
            <p><strong>What this map shows:</strong> spot clusters by neighborhood.</p>
            <p>Blue pins = 100+ Mbps verified. Gray pins = under 100 Mbps.</p>
            <p className="text-xs text-slate-500">Note: pin locations are approximate neighborhood placement for now.</p>
          </div>
          <div className="h-[520px] rounded-xl overflow-hidden border border-slate-200">
            <MapContainer
              center={[38.89, -77.19]}
              zoom={10.5}
              scrollWheelZoom={false}
              style={{ height: "100%", width: "100%" }}
            >
              <MapResizeFix trigger={view} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {withCoords.map(({ spot, lat, lng }) => (
                <CircleMarker
                  key={spot.id}
                  center={[lat, lng]}
                  radius={8}
                  pathOptions={{
                    color: spot.highSpeedWifi ? "#2563eb" : "#64748b",
                    fillColor: spot.highSpeedWifi ? "#3b82f6" : "#94a3b8",
                    fillOpacity: 0.85,
                  }}
                >
                  <Popup>
                    <div className="space-y-1 min-w-[180px]">
                      <p className="font-semibold text-slate-900">{spot.name}</p>
                      <p className="text-xs text-slate-600">{NEIGHBORHOODS[spot.neighborhood]} • {spot.logistics.wifiSpeedDown} Mbps</p>
                      <Link href={`/location/${spot.neighborhood}/${spot.slug}`} className="text-xs text-indigo-600 hover:underline">
                        View spot details
                      </Link>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
        </div>
      )}
    </div>
  );
}
