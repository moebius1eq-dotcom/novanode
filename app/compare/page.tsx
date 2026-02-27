"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import spotsData from "@/data/spots.json";
import { WorkSpot } from "@/lib/types";
import { NEIGHBORHOODS } from "@/lib/constants";

export default function ComparePage() {
  const spots = spotsData.spots as WorkSpot[];
  
  const [selectedSpots, setSelectedSpots] = useState<WorkSpot[]>([]);
  const [availableSpots] = useState<WorkSpot[]>(spots);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("compareSpots");
    if (stored) {
      const ids = JSON.parse(stored);
      const selected = spots.filter(s => ids.includes(s.id));
      setSelectedSpots(selected);
    }
  }, [spots]);

  const addSpot = (spot: WorkSpot) => {
    if (selectedSpots.length < 4 && !selectedSpots.find(s => s.id === spot.id)) {
      const newSelection = [...selectedSpots, spot];
      setSelectedSpots(newSelection);
      localStorage.setItem("compareSpots", JSON.stringify(newSelection.map(s => s.id)));
    }
  };

  const removeSpot = (spotId: string) => {
    const newSelection = selectedSpots.filter(s => s.id !== spotId);
    setSelectedSpots(newSelection);
    localStorage.setItem("compareSpots", JSON.stringify(newSelection.map(s => s.id)));
  };

  const clearAll = () => {
    setSelectedSpots([]);
    localStorage.removeItem("compareSpots");
  };

  // Compare metrics
  const metrics = [
    { label: "Wi-Fi Download", key: "wifiSpeedDown", unit: "Mbps", higher: true },
    { label: "Wi-Fi Upload", key: "wifiSpeedUp", unit: "Mbps", higher: true },
    { label: "Noise Level", key: "noiseLevel", unit: "dB", higher: false, inverse: true },
    { label: "Rating", key: "rating", unit: "", higher: true, from: "seo" },
    { label: "Reviews", key: "reviewCount", unit: "", higher: true, from: "seo" },
  ];

  const getValue = (spot: WorkSpot, metric: typeof metrics[0]) => {
    if (metric.from === "seo") {
      return metric.key === "rating" ? spot.seo.rating : spot.seo.reviewCount;
    }
    return metric.key === "wifiSpeedDown" ? spot.logistics.wifiSpeedDown
      : metric.key === "wifiSpeedUp" ? spot.logistics.wifiSpeedUp
      : metric.key === "noiseLevel" ? spot.logistics.noiseLevel
      : 0;
  };

  const getWinner = (metric: typeof metrics[0]) => {
    if (selectedSpots.length === 0) return null;
    const values = selectedSpots.map(s => getValue(s, metric));
    const bestIdx = metric.inverse 
      ? values.indexOf(Math.min(...values as number[]))
      : values.indexOf(Math.max(...values as number[]));
    return bestIdx;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            ⚖️ Compare Work Spots
          </h1>
          <p className="text-slate-600">
            Select up to 4 spots to compare side-by-side
          </p>
        </div>

        {/* Selected Spots */}
        {selectedSpots.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
            {/* Header Row */}
            <div className="grid grid-cols-[180px_repeat(auto-fit,minmax(140px,1fr))] gap-4 p-4 bg-slate-100 border-b border-slate-200">
              <div className="text-sm font-semibold text-slate-600">Metric</div>
              {selectedSpots.map((spot) => (
                <div key={spot.id} className="text-center">
                  <button
                    onClick={() => removeSpot(spot.id)}
                    className="text-xs text-red-500 hover:text-red-700 underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Comparison Rows */}
            {metrics.map((metric) => {
              const winnerIdx = getWinner(metric);
              return (
                <div 
                  key={metric.label}
                  className="grid grid-cols-[180px_repeat(auto-fit,minmax(140px,1fr))] gap-4 p-4 border-b border-slate-100 hover:bg-slate-50"
                >
                  <div className="text-sm font-medium text-slate-700 flex items-center">
                    {metric.label}
                  </div>
                  {selectedSpots.map((spot, idx) => {
                    const value = getValue(spot, metric);
                    const isWinner = idx === winnerIdx && selectedSpots.length > 1;
                    return (
                      <div 
                        key={spot.id} 
                        className={`text-center ${
                          isWinner 
                            ? "bg-green-50 -mx-4 px-4 rounded-lg" 
                            : ""
                        }`}
                      >
                        <span className={`text-lg font-bold ${
                          isWinner ? "text-green-700" : "text-slate-900"
                        }`}>
                          {metric.key === "rating" ? value.toFixed(1) : value}
                        </span>
                        <span className="text-xs text-slate-500 ml-1">{metric.unit}</span>
                        {isWinner && <span className="ml-1 text-green-600">✓</span>}
                      </div>
                    );
                  })}
                </div>
              );
            })}

            {/* Feature Rows */}
            <div className="grid grid-cols-[180px_repeat(auto-fit,minmax(140px,1fr))] gap-4 p-4 border-b border-slate-100">
              <div className="text-sm font-medium text-slate-700 flex items-center">Outlets</div>
              {selectedSpots.map((spot) => (
                <div key={spot.id} className="text-center text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    spot.logistics.outletDensity === "plenty" 
                      ? "bg-green-100 text-green-700"
                      : spot.logistics.outletDensity === "moderate"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {spot.logistics.outletDensity}
                  </span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-[180px_repeat(auto-fit,minmax(140px,1fr))] gap-4 p-4 border-b border-slate-100">
              <div className="text-sm font-medium text-slate-700 flex items-center">Open Late</div>
              {selectedSpots.map((spot) => (
                <div key={spot.id} className="text-center text-sm">
                  {spot.openLate ? "🌙 Yes" : "—"}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-[180px_repeat(auto-fit,minmax(140px,1fr))] gap-4 p-4">
              <div className="text-sm font-medium text-slate-700 flex items-center">Neighborhood</div>
              {selectedSpots.map((spot) => (
                <div key={spot.id} className="text-center text-sm text-slate-600">
                  {NEIGHBORHOODS[spot.neighborhood]}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center mb-8">
            <p className="text-slate-500 mb-4">No spots selected for comparison</p>
            <p className="text-sm text-slate-400">Add spots from the list below</p>
          </div>
        )}

        {/* Add More Spots */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-slate-900">
              {selectedSpots.length >= 4 ? "Comparison Full" : "Add Spots to Compare"}
            </h2>
            {selectedSpots.length > 0 && (
              <button
                onClick={clearAll}
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                Clear all
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {availableSpots.map((spot) => {
              const isSelected = selectedSpots.some(s => s.id === spot.id);
              const isDisabled = selectedSpots.length >= 4 && !isSelected;
              
              return (
                <button
                  key={spot.id}
                  onClick={() => isSelected ? removeSpot(spot.id) : addSpot(spot)}
                  disabled={isDisabled}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    isSelected
                      ? "border-indigo-500 bg-indigo-50"
                      : isDisabled
                      ? "border-slate-200 opacity-50 cursor-not-allowed"
                      : "border-slate-200 hover:border-indigo-300"
                  }`}
                >
                  <p className="font-medium text-sm text-slate-900 truncate">{spot.name}</p>
                  <p className="text-xs text-slate-500">{NEIGHBORHOODS[spot.neighborhood]}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-8">
          <Link href="/" className="text-indigo-600 hover:text-indigo-700 font-medium">
            ← Back to all spots
          </Link>
        </div>
      </div>
    </div>
  );
}
