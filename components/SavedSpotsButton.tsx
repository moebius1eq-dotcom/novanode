"use client";

import { useState, useEffect } from "react";

interface SavedSpotsButtonProps {
  spotId: string;
  spotName: string;
}

export default function SavedSpotsButton({ spotId, spotName }: SavedSpotsButtonProps) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("novanode_saved_spots");
    if (saved) {
      const ids = JSON.parse(saved);
      setIsSaved(ids.includes(spotId));
    }
  }, [spotId]);

  const toggleSaved = () => {
    const saved = localStorage.getItem("novanode_saved_spots");
    let ids: string[] = saved ? JSON.parse(saved) : [];

    if (ids.includes(spotId)) {
      ids = ids.filter(id => id !== spotId);
    } else {
      ids.push(spotId);
    }

    localStorage.setItem("novanode_saved_spots", JSON.stringify(ids));
    setIsSaved(!isSaved);
  };

  return (
    <button
      onClick={toggleSaved}
      className={`p-2 rounded-lg transition-colors ${
        isSaved
          ? "bg-red-100 text-red-600"
          : "bg-slate-100 text-slate-400 hover:bg-slate-200"
      }`}
      title={isSaved ? "Remove from saved" : "Save for later"}
    >
      <svg
        className="w-5 h-5"
        fill={isSaved ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
}