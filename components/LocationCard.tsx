"use client";

import Link from "next/link";
import { WorkSpot } from "@/lib/types";
import { NEIGHBORHOODS } from "@/lib/constants";
import LogisticsCard from "./LogisticsCard";
import VibeIndicator from "./VibeIndicator";

interface LocationCardProps {
  spot: WorkSpot;
}

export default function LocationCard({ spot }: LocationCardProps) {
  return (
    <Link 
      href={`/location/${spot.neighborhood}/${spot.slug}`}
      className="location-card group"
    >
      {/* Image Placeholder */}
      <div className="h-48 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center relative overflow-hidden">
        <span className="text-6xl">☕</span>
        
        {/* Vibe Badge Overlay */}
        <div className="absolute top-3 right-3">
          <VibeIndicator vibe={spot.vibe.primary} size="sm" />
        </div>
        
        {/* Quick Stats Overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center gap-3 text-xs font-medium text-white/90">
            <span className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-1 rounded">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
              </svg>
              {spot.logistics.wifiSpeedDown} Mbps
            </span>
            {spot.highSpeedWifi && (
              <span className="flex items-center gap-1 bg-green-500/80 backdrop-blur-sm px-2 py-1 rounded">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Fast
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Neighborhood Tag */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-indigo-600 uppercase tracking-wide">
            {NEIGHBORHOODS[spot.neighborhood]}
          </span>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {spot.seo.rating} ({spot.seo.reviewCount})
          </div>
        </div>

        {/* Name */}
        <h3 className="font-semibold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors mb-1">
          {spot.name}
        </h3>

        {/* Address */}
        <p className="text-sm text-slate-500 mb-3 line-clamp-1">
          {spot.address}
        </p>

        {/* Compact Logistics */}
        <LogisticsCard logistics={spot.logistics} compact />

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100">
          {spot.vibe.tags.slice(0, 4).map((tag) => (
            <span 
              key={tag}
              className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
