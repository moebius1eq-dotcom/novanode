"use client";

import { useState, useEffect } from "react";

interface CrowdMeterProps {
  spotId: string;
}

type CrowdLevel = "quiet" | "moderate" | "full" | null;

export default function CrowdMeter({ spotId }: CrowdMeterProps) {
  const [voted, setVoted] = useState<CrowdLevel>(null);

  useEffect(() => {
    const votes = localStorage.getItem(`novanode_vote_${spotId}`);
    if (votes) {
      setVoted(JSON.parse(votes));
    }
  }, [spotId]);

  const handleVote = (level: CrowdLevel) => {
    localStorage.setItem(`novanode_vote_${spotId}`, JSON.stringify(level));
    setVoted(level);
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium text-slate-600 uppercase">How is it right now?</p>
      <div className="flex gap-2">
        <button
          onClick={() => handleVote("quiet")}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
            voted === "quiet"
              ? "bg-green-500 text-white"
              : "bg-green-50 text-green-700 hover:bg-green-100"
          }`}
        >
          🟢 Quiet
        </button>
        <button
          onClick={() => handleVote("moderate")}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
            voted === "moderate"
              ? "bg-yellow-500 text-white"
              : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
          }`}
        >
          🟡 Moderate
        </button>
        <button
          onClick={() => handleVote("full")}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
            voted === "full"
              ? "bg-red-500 text-white"
              : "bg-red-50 text-red-700 hover:bg-red-100"
          }`}
        >
          🔴 Full
        </button>
      </div>
      {voted && (
        <p className="text-xs text-slate-500">Thanks for voting! Last updated: just now</p>
      )}
    </div>
  );
}