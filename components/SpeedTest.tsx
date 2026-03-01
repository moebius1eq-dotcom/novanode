"use client";

import { useState } from "react";
import * as amplitude from "@amplitude/analytics-browser";
import { WorkSpot } from "@/lib/types";

interface SpeedTestProps {
  spot: WorkSpot;
}

interface SpeedResult {
  latencyMs: number;
  downloadMbps: number;
  uploadMbps: number;
}

function mbpsFromBytes(bytes: number, ms: number) {
  const seconds = ms / 1000;
  if (seconds <= 0) return 0;
  return Number((((bytes * 8) / 1_000_000) / seconds).toFixed(1));
}

export default function SpeedTest({ spot }: SpeedTestProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<SpeedResult | null>(null);
  const [message, setMessage] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const communityEnabled = process.env.NEXT_PUBLIC_ENABLE_COMMUNITY === "true";

  async function runTest() {
    setIsRunning(true);
    setMessage("");
    setResult(null);

    try {
      const pingStart = performance.now();
      await fetch(`/api/speed/ping?t=${Date.now()}`, { cache: "no-store" });
      const latencyMs = Math.max(1, Math.round(performance.now() - pingStart));

      const dlStart = performance.now();
      const dlResponse = await fetch(`/api/speed/download?sizeMb=5&t=${Date.now()}`, {
        cache: "no-store",
      });
      const dlBuffer = await dlResponse.arrayBuffer();
      const dlDuration = performance.now() - dlStart;
      const downloadMbps = mbpsFromBytes(dlBuffer.byteLength, dlDuration);

      const uploadBytes = 2 * 1024 * 1024;
      const uploadPayload = new Uint8Array(uploadBytes);
      crypto.getRandomValues(uploadPayload.subarray(0, Math.min(uploadBytes, 65536)));
      const ulStart = performance.now();
      await fetch("/api/speed/upload", {
        method: "POST",
        headers: { "Content-Type": "application/octet-stream" },
        body: uploadPayload,
      });
      const ulDuration = performance.now() - ulStart;
      const uploadMbps = mbpsFromBytes(uploadBytes, ulDuration);

      setResult({ latencyMs, downloadMbps, uploadMbps });
      amplitude.track("Speed Test Completed", {
        spotId: spot.id,
        spotSlug: spot.slug,
        latencyMs,
        downloadMbps,
        uploadMbps,
      });
      setMessage("Speed test complete.");
    } catch {
      setMessage("Speed test failed. Please try again.");
    } finally {
      setIsRunning(false);
    }
  }

  async function submitResult() {
    if (!result) return;
    if (!communityEnabled) {
      setMessage("Community submissions are temporarily unavailable.");
      return;
    }
    setSubmitting(true);
    setMessage("");

    const payload = {
      spotId: spot.id,
      spotSlug: spot.slug,
      spotName: spot.name,
      neighborhood: spot.neighborhood,
      latencyMs: result.latencyMs,
      downloadMbps: result.downloadMbps,
      uploadMbps: result.uploadMbps,
    };

    try {
      const response = await fetch("/api/speed/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("submit failed");
      }

      amplitude.track("Speed Submitted", {
        spotId: spot.id,
        spotSlug: spot.slug,
        latencyMs: result.latencyMs,
        downloadMbps: result.downloadMbps,
        uploadMbps: result.uploadMbps,
      });
      setMessage("Thanks — your speed result was submitted to NoVaNode.");
    } catch {
      const key = "speedSubmissionsFallback";
      const existingRaw = localStorage.getItem(key);
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      existing.unshift({ ...payload, createdAt: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(existing.slice(0, 100)));
      setMessage("Saved locally on this device. Server submit unavailable right now.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200">
      <h3 className="font-semibold text-slate-900 mb-2">⚡ Live Speed Test</h3>
      <p className="text-sm text-slate-600 mb-4">
        At this spot right now? Run a quick test and submit your result.
      </p>

      <button
        onClick={runTest}
        disabled={isRunning}
        className="w-full px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-60"
      >
        {isRunning ? "Running test…" : "Run speed test"}
      </button>

      {result && (
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
            <p className="text-xs text-slate-500">Latency</p>
            <p className="text-lg font-semibold text-slate-900">{result.latencyMs} ms</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
            <p className="text-xs text-slate-500">Download</p>
            <p className="text-lg font-semibold text-slate-900">{result.downloadMbps} Mbps</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
            <p className="text-xs text-slate-500">Upload</p>
            <p className="text-lg font-semibold text-slate-900">{result.uploadMbps} Mbps</p>
          </div>
        </div>
      )}

      <button
        onClick={submitResult}
        disabled={!result || submitting || !communityEnabled}
        className="mt-4 w-full px-4 py-2.5 border border-indigo-300 text-indigo-700 rounded-lg font-medium hover:bg-indigo-50 disabled:opacity-50"
      >
        {submitting ? "Submitting…" : "Submit this speed to NoVaNode"}
      </button>

      {!communityEnabled && <p className="mt-3 text-sm text-slate-500">Submit is temporarily unavailable while backend persistence is being upgraded.</p>}
      {message && <p className="mt-3 text-sm text-slate-600">{message}</p>}
    </div>
  );
}
