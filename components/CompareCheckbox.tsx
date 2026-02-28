"use client";

import { useState } from "react";
import { WorkSpot } from "@/lib/types";

interface CompareCheckboxProps {
  spot: WorkSpot;
  onToggle: (spot: WorkSpot) => void;
  isSelected: boolean;
}

export default function CompareCheckbox({ spot, onToggle, isSelected }: CompareCheckboxProps) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle(spot);
      }}
      className={`absolute top-3 left-3 z-10 p-2 rounded-lg border-2 transition-all ${
        isSelected 
          ? "bg-indigo-600 border-indigo-600 text-white" 
          : "bg-white border-slate-300 text-slate-400 hover:border-indigo-500 hover:text-indigo-500"
      }`}
      title={isSelected ? "Remove from comparison" : "Add to comparison"}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    </button>
  );
}
