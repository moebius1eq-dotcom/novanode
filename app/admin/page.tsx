"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Metrics {
  speedSubmissions: number;
  seatReports: number;
  vibePhotos: number;
  newsletterSignups: number;
  workBuddySignals: number;
  moderationQueue: number;
}

export default function AdminHomePage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  useEffect(() => {
    (async () => {
      const token = new URLSearchParams(window.location.search).get("token");
      const res = await fetch(`/api/admin/metrics${token ? `?token=${encodeURIComponent(token)}` : ""}`, {
        cache: "no-store",
        headers: token ? { "x-admin-token": token } : {},
      });
      if (res.ok) {
        setMetrics((await res.json()) as Metrics);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">NoVaNode Admin</h1>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {metrics
            ? Object.entries(metrics).map(([k, v]) => (
                <div key={k} className="bg-white rounded-lg border border-slate-200 p-4">
                  <p className="text-xs text-slate-500">{k}</p>
                  <p className="text-xl font-semibold text-slate-900">{v}</p>
                </div>
              ))
            : <p className="text-sm text-slate-500">Loading metrics…</p>}
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <h2 className="font-semibold text-slate-900 mb-2">Tools</h2>
          <ul className="space-y-2 text-sm">
            <li><Link href="/admin/moderation" className="text-indigo-600 hover:underline">Moderation Queue</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
