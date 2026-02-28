"use client";

import { useEffect, useState } from "react";

interface CommunitySpeedTrendProps {
  spotId: string;
}

interface TrendResponse {
  count: number;
  medianDownloadMbps: number;
  medianUploadMbps: number;
  medianLatencyMs: number;
  latestAt: string | null;
}

export default function CommunitySpeedTrend({ spotId }: CommunitySpeedTrendProps) {
  const [data, setData] = useState<TrendResponse | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadTrend() {
    try {
      const response = await fetch(`/api/speed/submit?spotId=${encodeURIComponent(spotId)}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed");
      }

      const json = (await response.json()) as TrendResponse;
      setData(json);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTrend();
    const interval = setInterval(loadTrend, 30000);
    return () => clearInterval(interval);
  }, [spotId]);

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-slate-900">📈 Community speed trend</h3>
        <button onClick={loadTrend} className="text-xs text-indigo-600 hover:text-indigo-700">
          Refresh
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Loading community results…</p>
      ) : !data || data.count === 0 ? (
        <p className="text-sm text-slate-500">No community submissions yet. Be the first to run a test.</p>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
              <p className="text-xs text-slate-500">Median Down</p>
              <p className="text-lg font-semibold text-slate-900">{data.medianDownloadMbps} Mbps</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
              <p className="text-xs text-slate-500">Median Up</p>
              <p className="text-lg font-semibold text-slate-900">{data.medianUploadMbps} Mbps</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
              <p className="text-xs text-slate-500">Median Latency</p>
              <p className="text-lg font-semibold text-slate-900">{data.medianLatencyMs} ms</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Based on {data.count} recent submission{data.count === 1 ? "" : "s"}
            {data.latestAt ? ` • latest ${new Date(data.latestAt).toLocaleString()}` : ""}
          </p>
        </>
      )}
    </div>
  );
}
