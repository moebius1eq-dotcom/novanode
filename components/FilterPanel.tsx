"use client";

import { WorkSpot } from "@/lib/types";
import { NEIGHBORHOODS } from "@/lib/constants";

interface FilterPanelProps {
  spots: WorkSpot[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  neighborhoods: string[];
  minUploadSpeed: number;
  outletDensity: "plenty" | "moderate" | "all";
  openAfter8pm: boolean;
  highSpeedWifi: boolean;
  vibes: string[];
}

const VIBE_OPTIONS = [
  { value: "focus", label: "Focus", emoji: "🎯" },
  { value: "quiet", label: "Quiet", emoji: "🤫" },
  { value: "social", label: "Social", emoji: "💬" },
];

export default function FilterPanel({ filters, onFilterChange }: FilterPanelProps) {
  const toggleNeighborhood = (n: string) => {
    const new neighborhoods = filters.neighborhoods.includes(n)
      ? filters.neighborhoods.filter((x) => x !== n)
      : [...filters.neighborhoods, n];
    onFilterChange({ ...filters, neighborhoods: new neighborhoods });
  };

  const toggleVibe = (v: string) => {
    const new vibes = filters.vibes.includes(v)
      ? filters.vibes.filter((x) => x !== v)
      : [...filters.vibes, v];
    onFilterChange({ ...filters, vibes: new vibes });
  };

  return (
    <div className="space-y-6">
      {/* Standard Neighborhood Filter */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-3">📍 Neighborhood</h3>
        <div className="space-y-2">
          {Object.entries(NEIGHBORHOODS).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.neighborhoods.includes(key)}
                onChange={() => toggleNeighborhood(key)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-600 group-hover:text-slate-900">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Pain Point Filters */}
      <div className="pt-4 border-t border-slate-200">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">🎯 Specific Needs</h3>
        
        {/* Video Call Test - Upload > 15Mbps */}
        <label className="flex items-start gap-3 p-3 mb-2 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
          <input
            type="checkbox"
            checked={filters.minUploadSpeed >= 15}
            onChange={(e) => onFilterChange({ ...filters, minUploadSpeed: e.target.checked ? 15 : 0 })}
            className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <div>
            <span className="text-sm font-medium text-blue-900">📹 Video Call Test</span>
            <p className="text-xs text-blue-700">Upload speed &gt;15 Mbps (Zoom/Meet friendly)</p>
          </div>
        </label>

        {/* Power Hungry - High outlet density */}
        <label className="flex items-start gap-3 p-3 mb-2 bg-amber-50 rounded-lg cursor-pointer hover:bg-amber-100 transition-colors">
          <input
            type="checkbox"
            checked={filters.outletDensity === "plenty"}
            onChange={(e) => onFilterChange({ ...filters, outletDensity: e.target.checked ? "plenty" : "all" })}
            className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <div>
            <span className="text-sm font-medium text-amber-900">🔌 Power Hungry</span>
            <p className="text-xs text-amber-700">&gt;50% tables have outlets</p>
          </div>
        </label>

        {/* Late Night Hub */}
        <label className="flex items-start gap-3 p-3 mb-2 bg-indigo-50 rounded-lg cursor-pointer hover:bg-indigo-100 transition-colors">
          <input
            type="checkbox"
            checked={filters.openAfter8pm}
            onChange={(e) => onFilterChange({ ...filters, openAfter8pm: e.target.checked })}
            className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <div>
            <span className="text-sm font-medium text-indigo-900">🌙 Late Night Hub</span>
            <p className="text-xs text-indigo-700">Open after 8 PM</p>
          </div>
        </label>

        {/* High Speed Wifi */}
        <label className="flex items-start gap-3 p-3 mb-2 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition-colors">
          <input
            type="checkbox"
            checked={filters.highSpeedWifi}
            onChange={(e) => onFilterChange({ ...filters, highSpeedWifi: e.target.checked })}
            className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <div>
            <span className="text-sm font-medium text-green-900">⚡ High-Speed WiFi</span>
            <p className="text-xs text-green-700">Gigabit or faster</p>
          </div>
        </label>
      </div>

      {/* Vibe Filter */}
      <div className="pt-4 border-t border-slate-200">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">🎭 Vibe</h3>
        <div className="flex flex-wrap gap-2">
          {VIBE_OPTIONS.map((vibe) => (
            <button
              key={vibe.value}
              onClick={() => toggleVibe(vibe.value)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                filters.vibes.includes(vibe.value)
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <span>{vibe.emoji}</span>
              <span>{vibe.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {(filters.neighborhoods.length > 0 || 
        filters.minUploadSpeed > 0 || 
        filters.outletDensity !== "all" || 
        filters.openAfter8pm || 
        filters.highSpeedWifi ||
        filters.vibes.length > 0) && (
        <button
          onClick={() => onFilterChange({
            neighborhoods: [],
            minUploadSpeed: 0,
            outletDensity: "all",
            openAfter8pm: false,
            highSpeedWifi: false,
            vibes: [],
          })}
          className="w-full py-2 text-sm text-slate-500 hover:text-slate-700"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
