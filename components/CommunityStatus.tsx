"use client";

import { useState } from "react";
import { WorkSpot } from "@/lib/types";

interface CommunityStatusProps {
  spot: WorkSpot;
}

// Simulated "usual" status based on time of day
function getUsualStatus(hour: number): string {
  if (hour >= 6 && hour < 9) return "Usually quiet - morning rush hasn't started";
  if (hour >= 9 && hour < 12) return "Usually moderate - morning workers";
  if (hour >= 12 && hour < 14) return "Usually busy - lunch rush";
  if (hour >= 14 && hour < 17) return "Usually moderate - afternoon";
  if (hour >= 17 && hour < 20) return "Usually busy - evening switch";
  if (hour >= 20) return "Usually quiet - evening wind-down";
  return "Usually quiet - off hours";
}

export default function CommunityStatus({ spot }: CommunityStatusProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [hasReported, setHasReported] = useState(false);

  const hour = new Date().getHours();
  const usualStatus = getUsualStatus(hour);

  const statusOptions = [
    { emoji: "🟢", label: "Quiet", color: "bg-green-100 border-green-300 text-green-800" },
    { emoji: "🟡", label: "Moderate", color: "bg-yellow-100 border-yellow-300 text-yellow-800" },
    { emoji: "🔴", label: "Crowded", color: "bg-red-100 border-red-300 text-red-800" },
  ];

  const handleReport = (status: string) => {
    setSelectedStatus(status);
    setHasReported(true);
    setIsOpen(false);
  };

  return (
    <div className="bg-white rounded-xl p-4 border border-slate-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">👥</span>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide">Crowd Status</p>
            <p className="text-sm font-medium text-slate-700">
              {hasReported && selectedStatus 
                ? `You said: ${selectedStatus}` 
                : usualStatus}
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-3 py-1.5 text-xs font-medium bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
        >
          {hasReported ? "Update" : "Report"}
        </button>
      </div>

      {/* Status Selection Dropdown */}
      {isOpen && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-500 mb-3">How is it right now?</p>
          <div className="flex gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.label}
                onClick={() => handleReport(option.label)}
                className={`flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-lg border-2 text-sm font-medium transition-all hover:scale-105 ${option.color}`}
              >
                <span>{option.emoji}</span>
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Community Stats */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span>🕐 Updated {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <span>•</span>
          <span>📊 {Math.floor(Math.random() * 50) + 10} reports this week</span>
        </div>
      </div>
    </div>
  );
}
