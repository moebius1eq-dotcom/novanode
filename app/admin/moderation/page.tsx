"use client";

import { useEffect, useState } from "react";

interface Item {
  id: string;
  kind: string;
  risk: "low" | "medium" | "high";
  reasons: string[];
  createdAt: string;
  payload: Record<string, unknown>;
}

export default function ModerationAdminPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [stats, setStats] = useState({ total: 0, high: 0, medium: 0 });

  useEffect(() => {
    (async () => {
      const token = new URLSearchParams(window.location.search).get("token");
      const res = await fetch(`/api/admin/moderation${token ? `?token=${encodeURIComponent(token)}` : ""}`, {
        cache: "no-store",
        headers: token ? { "x-admin-token": token } : {},
      });
      if (!res.ok) return;
      const json = await res.json() as { total: number; high: number; medium: number; items: Item[] };
      setItems(json.items);
      setStats({ total: json.total, high: json.high, medium: json.medium });
    })();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Moderation Queue</h1>
        <p className="text-sm text-slate-600">Total: {stats.total} • High: {stats.high} • Medium: {stats.medium}</p>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-slate-900">{item.kind}</p>
                <span className={`text-xs px-2 py-1 rounded ${item.risk === "high" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{item.risk}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{new Date(item.createdAt).toLocaleString()}</p>
              <p className="text-xs text-slate-600 mt-2">Reasons: {item.reasons.join(", ") || "none"}</p>
              <pre className="mt-2 text-xs bg-slate-50 p-2 rounded overflow-auto">{JSON.stringify(item.payload, null, 2)}</pre>
            </div>
          ))}
          {items.length === 0 && <p className="text-sm text-slate-500">No queued items.</p>}
        </div>
      </div>
    </div>
  );
}
