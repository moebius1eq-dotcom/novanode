"use client";

import { useEffect, useState } from "react";

export default function WorkBuddyToggle({ spotId }: { spotId: string }) {
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState("");

  async function refresh() {
    const res = await fetch(`/api/work-buddy?spotId=${encodeURIComponent(spotId)}`, { cache: "no-store" });
    if (res.ok) {
      const json = (await res.json()) as { count: number };
      setCount(json.count);
    }
  }

  useEffect(() => {
    refresh();
  }, [spotId]);

  async function mark(hours: number) {
    setStatus("Updating…");
    const until = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
    const res = await fetch("/api/work-buddy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ spotId, until }),
    });
    setStatus(res.ok ? `You are marked as working here for ~${hours}h.` : "Update failed.");
    refresh();
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200">
      <h3 className="font-semibold text-slate-900 mb-2">🤝 Work Buddy</h3>
      <p className="text-sm text-slate-600 mb-3">I’m working here until:</p>
      <div className="flex gap-2 mb-3">
        <button onClick={() => mark(2)} className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm">+2h</button>
        <button onClick={() => mark(4)} className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm">+4h</button>
      </div>
      <p className="text-sm text-slate-700">Active buddies now: <strong>{count}</strong></p>
      {status && <p className="text-xs text-slate-500 mt-2">{status}</p>}
    </div>
  );
}
