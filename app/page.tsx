"use client";

import { useState, useMemo, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import spotsData from "@/data/spots.json";
import { WorkSpot, Neighborhood } from "@/lib/types";
import { NEIGHBORHOODS } from "@/lib/constants";
import SearchBar from "@/components/SearchBar";
import LocationGrid from "@/components/LocationGrid";
import FilterPanel, { FilterState } from "@/components/FilterPanel";

function HomeContent() {
  const searchParams = useSearchParams();
  
  // Get filter params from URL
  const neighborhoodFilter = searchParams.get("neighborhood") as Neighborhood | null;
  const queryFilter = searchParams.get("q") || "";

  const spots = spotsData.spots as WorkSpot[];

  // Local filter state
  const [filters, setFilters] = useState<FilterState>({
    neighborhoods: neighborhoodFilter ? [neighborhoodFilter] : [],
    minUploadSpeed: 0,
    outletDensity: "all",
    openAfter8pm: false,
    highSpeedWifi: false,
    vibes: [],
  });

  const [showCompareBar, setShowCompareBar] = useState(false);
  const [compareCount, setCompareCount] = useState(0);

  // Listen for compare changes
  useEffect(() => {
    const stored = localStorage.getItem("compareSpots");
    if (stored) {
      const ids = JSON.parse(stored);
      setCompareCount(ids.length);
      setShowCompareBar(ids.length > 0);
    }

    const handleCompareChange = (e: CustomEvent) => {
      setCompareCount(e.detail.ids.length);
      setShowCompareBar(e.detail.ids.length > 0);
    };

    window.addEventListener("compareChange", handleCompareChange as EventListener);
    return () => window.removeEventListener("compareChange", handleCompareChange as EventListener);
  }, []);

  // Filter spots based on all filters
  const filteredSpots = useMemo(() => {
    return spots.filter((spot) => {
      // Neighborhood filter
      if (filters.neighborhoods.length > 0 && !filters.neighborhoods.includes(spot.neighborhood)) {
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
      
      // Upload speed filter (Video Call Test)
      if (filters.minUploadSpeed > 0 && spot.logistics.wifiSpeedUp < filters.minUploadSpeed) {
        return false;
      }
      
      // Outlet density filter (Power Hungry)
      if (filters.outletDensity === "plenty" && spot.logistics.outletDensity !== "plenty") {
        return false;
      }
      
      // Open after 8pm filter (Late Night Hub)
      if (filters.openAfter8pm) {
        const hasLateHours = spot.hours.some(h => {
          if (!h.open || !h.close) return false;
          const closeHour = parseInt(h.close.split(":")[0]);
          return closeHour >= 20;
        });
        if (!hasLateHours && !spot.openLate) return false;
      }
      
      // High-Speed Wi-Fi filter
      if (filters.highSpeedWifi && !spot.highSpeedWifi) {
        return false;
      }
      
      // Vibe filter
      if (filters.vibes.length > 0 && !filters.vibes.includes(spot.vibe.primary)) {
        return false;
      }
      
      return true;
    });
  }, [spots, filters, queryFilter]);

  // Get current filter state for display
  const getFilterSummary = () => {
    const filtersList: string[] = [];
    
    if (neighborhoodFilter) {
      filtersList.push(NEIGHBORHOODS[neighborhoodFilter]);
    }
    if (filters.highSpeedWifi) {
      filtersList.push("High-Speed Wi-Fi");
    }
    if (filters.openAfter8pm) {
      filtersList.push("Open After 8pm");
    }
    if (filters.minUploadSpeed > 0) {
      filtersList.push(`Upload >${filters.minUploadSpeed}Mbps`);
    }
    if (filters.outletDensity === "plenty") {
      filtersList.push("Plenty of Outlets");
    }
    if (queryFilter) {
      filtersList.push(`"${queryFilter}"`);
    }
    
    return filtersList;
  };

  const activeFilters = getFilterSummary();

  return (
    <div className="min-h-screen">
      {/* Compare Bar */}
      {showCompareBar && (
        <div className="fixed bottom-0 left-0 right-0 bg-indigo-600 text-white py-3 px-4 z-50 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-medium">
                {compareCount} {compareCount === 1 ? "spot" : "spots"} selected for comparison
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/compare"
                className="px-4 py-2 bg-white text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-colors"
              >
                ⚖️ Compare Now
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem("compareSpots");
                  setCompareCount(0);
                  setShowCompareBar(false);
                  window.dispatchEvent(new CustomEvent("compareChange", { detail: { ids: [] } }));
                }}
                className="text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

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
            <a href="/free-alternatives" className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
              <span>💰</span>
              <span><strong>Free Spots</strong></span>
            </a>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <a href="/?highSpeed=true" className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
              ⚡ High-Speed WiFi
            </a>
            <a href="/?openLate=true" className="px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors">
              🌙 Open Now
            </a>
            <a href="/free-parking-remote-work" className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
              🅿️ Free Parking
            </a>
            <a href="/laptop-friendly-weekends" className="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors">
              💻 Weekend Friendly
            </a>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filter Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-xl p-4 border border-slate-200 sticky top-4">
                <FilterPanel 
                  filters={filters}
                  onFilterChange={setFilters}
                  spots={spots}
                />
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
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

                {/* Compare Toggle */}
                <button
                  onClick={() => {
                    const stored = localStorage.getItem("compareSpots");
                    const ids = stored ? JSON.parse(stored) : [];
                    if (ids.length > 0) {
                      window.location.href = "/compare";
                    } else {
                      alert("Click the compare checkbox on any card to add spots for comparison");
                    }
                  }}
                  className="px-4 py-2 border-2 border-indigo-600 text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  ⚖️ Compare ({compareCount})
                </button>
              </div>

              {/* Location Grid */}
              <LocationGrid 
                spots={filteredSpots} 
                emptyMessage="No spots match your filters. Try adjusting your search."
              />
            </div>
          </div>
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
