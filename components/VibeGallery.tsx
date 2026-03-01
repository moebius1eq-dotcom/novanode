"use client";

import { useEffect, useState } from "react";
import * as amplitude from "@amplitude/analytics-browser";

interface VibeItem {
  url: string;
  createdAt: string;
}

export default function VibeGallery({ spotId }: { spotId: string }) {
  const [item, setItem] = useState<VibeItem | null>(null);
  const [status, setStatus] = useState("");
  const communityEnabled = process.env.NEXT_PUBLIC_ENABLE_COMMUNITY === "true";

  async function load() {
    if (!communityEnabled) return;
    const res = await fetch(`/api/vibe-photo?spotId=${encodeURIComponent(spotId)}`, { cache: "no-store" });
    if (res.ok) {
      const json = (await res.json()) as { items: VibeItem[] };
      setItem(json.items[0] ?? null);
    }
  }

  useEffect(() => {
    load();
  }, [spotId]);

  async function upload(file: File) {
    if (!communityEnabled) {
      setStatus("Community uploads are temporarily unavailable.");
      return;
    }
    setStatus("Uploading…");
    const form = new FormData();
    form.append("spotId", spotId);
    form.append("file", file);
    const res = await fetch("/api/vibe-photo", { method: "POST", body: form });

    if (res.ok) {
      amplitude.track("Vibe Photo Uploaded", { spotId });
      setStatus("Uploaded current vibe photo.");
      load();
      return;
    }

    const body = await res.json().catch(() => ({ error: "Upload failed." }));
    setStatus(body.error ?? "Upload failed.");
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200">
      <h3 className="font-semibold text-slate-900 mb-2">📸 Current Vibe Gallery</h3>
      <p className="text-sm text-slate-600 mb-3">Upload one no-login vibe photo for this spot.</p>
      {item ? (
        <img src={item.url} alt="Current vibe" className="w-full h-40 object-cover rounded-lg border border-slate-200 mb-3" />
      ) : (
        <div className="w-full h-40 rounded-lg border border-dashed border-slate-300 mb-3 flex items-center justify-center text-sm text-slate-500">No vibe photo yet</div>
      )}
      <input disabled={!communityEnabled} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} className="text-sm disabled:opacity-50" />
      {status && <p className="mt-2 text-xs text-slate-500">{status}</p>}
    </div>
  );
}
