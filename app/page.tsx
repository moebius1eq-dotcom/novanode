"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import spotsData from "@/data/spots.json";
import { WorkSpot, Neighborhood } from "@/lib/types";
import { NEIGHBORHOODS } from "@/lib/constants";
import SearchBar from "@/components/SearchBar";
import LocationGrid from "@/components/LocationGrid";

function HomeContent() {
  const searchParams = useSearchParams();
  
  // Get filter params from URL
  const neighborhoodFilter = searchParams.get("neighborhood") as Neighborhood | null;
  const queryFilter = searchParams.get("q") || "";
  const highSpeedWifiFilter = searchParams.get("wifi") === "true";
  const openLateFilter = searchParams.get("late") === "true";

  const spots = spotsData.spots as WorkSpot[];

  // Filter spots based on URL params
  const filteredSpots = useMemo(() => {
    return spots.filter((spot) => {
      // Neighborhood filter
      if (neighborhoodFilter && spot.neighborhood !== neighborhoodFilter) {
        return false;
      }
      
      // Search query filter
      if (queryFilter) {
        const query = queryFilter.toLowerCase();
        const matchesName = spot.name.toLowerCase().includes(query);
        const matchesNeighborhood = spot.neighborhood.toLowerCase().includes(query);
        const matchesTags = spot.vibe.tags.some((tag) => tag.toLowerCase().includes(query));
        const matchesAddress = spot.address.toLowerCase().includes(query);
        
        if (!matchesName && !matchesNeighborhood && !matchesTags && !matchesAddress) {
          return false;
        }
      }
      
      // High-Speed Wi-Fi filter
      if (highSpeedWifiFilter && !spot.highSpeedWifi) {
        return false;
      }
      
      // Open Late filter
      if (openLateFilter && !spot.openLate) {
        return false;
      }
      
      return true;
    });
  }, [neighborhoodFilter, queryFilter, highSpeedWifiFilter, openLateFilter]);

  // Get current filter state for display
  const getFilterSummary = () => {
    const filters: string[] = [];
    
    if (neighborhoodFilter) {
      filters.push(NEIGHBORHOODS[neighborhoodFilter]);
    }
    if (highSpeedWifiFilter) {
      filters.push("High-Speed Wi-Fi");
    }
    if (openLateFilter) {
      filters.push("Open Late");
    }
    if (queryFilter) {
      filters.push(`"${queryFilter}"`);
    }
    
    return filters;
  };

  const activeFilters = getFilterSummary();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-indigo-50 to-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Find Your Perfect<br />
              <span className="text-indigo-600">Remote Work Spot</span> in NoVa
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Verified Wi-Fi speeds, outlet density, noise levels, and seating types. 
              Real data for real remote workers.
            </p>
          </div>

          {/* Search Bar */}
          <SearchBar />

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📍</span>
              <span><strong className="text-slate-900">{spots.length}</strong> spots verified</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <span><strong className="text-slate-900">{spots.filter(s => s.highSpeedWifi).length}</strong> high-speed Wi-Fi</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌙</span>
              <span><strong className="text-slate-900">{spots.filter(s => s.openLate).length}</strong> open late</span>
            </div>
            <a href="/virginia-laptop-policies" className="flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors">
              <span>💻</span>
              <span><strong>Laptop Policies</strong></span>
            </a>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Filter Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {neighborhoodFilter ? NEIGHBORHOODS[neighborhoodFilter] : "All Locations"}
              </h2>
              <p className="text-slate-500">
                {filteredSpots.length} {filteredSpots.length === 1 ? "spot" : "spots"} found
                {activeFilters.length > 0 && (
                  <span className="ml-2">
                    {activeFilters.map((filter, i) => (
                      <span key={filter} className="inline-flex items-center">
                        {i > 0 && <span className="mx-1">·</span>}
                        <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs">
                          {filter}
                        </span>
                      </span>
                    ))}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Location Grid */}
          <LocationGrid 
            spots={filteredSpots} 
            emptyMessage="No spots match your filters. Try adjusting your search."
          />
        </div>
      </section>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">📍</div>
        <p className="text-slate-600">Loading NoVaNode...</p>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <HomeContent />
    </Suspense>
  );
}
