"use client";

export type MonetizationEventType =
  | "featured_spot_click"
  | "partner_day_pass_click"
  | "affiliate_power_click";

interface MonetizationEvent {
  type: MonetizationEventType;
  spotId?: string;
  spotSlug?: string;
  neighborhood?: string;
  meta?: Record<string, string | number | boolean>;
  ts: string;
}

export function trackMonetizationEvent(event: Omit<MonetizationEvent, "ts">) {
  const payload: MonetizationEvent = {
    ...event,
    ts: new Date().toISOString(),
  };

  try {
    const key = "novanodeMonetizationEvents";
    const existingRaw = localStorage.getItem(key);
    const existing = existingRaw ? (JSON.parse(existingRaw) as MonetizationEvent[]) : [];
    existing.unshift(payload);
    localStorage.setItem(key, JSON.stringify(existing.slice(0, 1000)));
  } catch {
    // no-op in restricted environments
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("novanode:monetization", { detail: payload }));
  }
}
