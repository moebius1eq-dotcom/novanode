"use client";

import { useEffect, useState } from "react";

type SeatState = "plenty" | "busy" | "full";

interface SeatStatusReporterProps {
  spotId: string;
}

interface SeatStatusResponse {
  count: number;
  currentState: SeatState | null;
  expiresInMinutes: number;
}

const labels: Record<SeatState, string> = {
  plenty: "🟢 Plenty of Seats",
  busy: "🟡 Busy",
  full: "🔴 Full",
};

export default function SeatStatusReporter({ spotId }: SeatStatusReporterProps) {
  const [data, setData] = useState<SeatStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<SeatState | null>(null);
  const communityEnabled = process.env.NEXT_PUBLIC_ENABLE_COMMUNITY === "true";

  async function loadStatus() {
    if (!communityEnabled) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/seat-status?spotId=${encodeURIComponent(spotId)}`, { cache: "no-store" });
      if (!response.ok) throw new Error("load failed");
      const json = (await response.json()) as SeatStatusResponse;
      setData(json);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStatus();
    const interval = setInterval(loadStatus, 30000);
    return () => clearInterval(interval);
  }, [spotId]);

  async function submit(state: SeatState) {
    if (!communityEnabled) return;
    setSubmitting(state);
    try {
      await fetch("/api/seat-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spotId, state }),
      });
      await loadStatus();
    } finally {
      setSubmitting(null);
    }
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200">
      <h3 className="font-semibold text-slate-900 mb-2">🪑 Live seat status</h3>
      <p className="text-sm text-slate-600 mb-3">Reports expire after 2 hours to keep this fresh.</p>

      <div className="grid grid-cols-1 gap-2 mb-4">
        {(Object.keys(labels) as SeatState[]).map((state) => (
          <button
            key={state}
            onClick={() => submit(state)}
            disabled={submitting !== null}
            className="text-left px-3 py-2 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 disabled:opacity-60"
          >
            {submitting === state ? "Submitting…" : labels[state]}
          </button>
        ))}
      </div>

      {!communityEnabled ? (
        <p className="text-sm text-slate-500">Live seat reports are temporarily unavailable.</p>
      ) : loading ? (
        <p className="text-sm text-slate-500">Loading live status…</p>
      ) : data?.currentState ? (
        <p className="text-sm text-slate-700">
          Current: <strong>{labels[data.currentState]}</strong>
          {data.count > 0 ? ` • ${data.count} recent report${data.count === 1 ? "" : "s"}` : ""}
          {data.expiresInMinutes > 0 ? ` • refreshes in ~${data.expiresInMinutes}m` : ""}
        </p>
      ) : (
        <p className="text-sm text-slate-500">No live seat reports yet.</p>
      )}
    </div>
  );
}
