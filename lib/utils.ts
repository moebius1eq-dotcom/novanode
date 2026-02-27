// lib/utils.ts

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { VibePrimary } from "./types";
import { VIBE_COLORS } from "./constants";

// === Tailwind Merger ===
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// === Slugify ===
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// === Format WiFi Speed ===
export function formatWiFiSpeed(mbps: number): string {
  if (mbps >= 1000) {
    return `${(mbps / 1000).toFixed(1)} Gbps`;
  }
  return `${mbps} Mbps`;
}

// === Get Vibe Color ===
export function getVibeColor(vibe: VibePrimary) {
  return VIBE_COLORS[vibe];
}

// === Format Hours ===
export function formatHours(open: string | null, close: string | null): string {
  if (!open || !close) return "Closed";
  
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
  };
  
  return `${formatTime(open)} - ${formatTime(close)}`;
}

// === Get Day Name ===
export function getDayName(dayIndex: number): string {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[dayIndex];
}

// === Check if High-Speed WiFi ===
export function isHighSpeedWifi(downSpeed: number): boolean {
  return downSpeed >= 100;
}

// === Noise Level Label ===
export function getNoiseLevelLabel(dba: number): { label: string; color: string } {
  if (dba <= 45) return { label: "Quiet", color: "text-green-600" };
  if (dba <= 70) return { label: "Moderate", color: "text-yellow-600" };
  return { label: "Loud", color: "text-red-600" };
}

// === Outlet Density Stars ===
export function getOutletDensityStars(density: "sparse" | "moderate" | "plenty"): string {
  const stars = { sparse: "☆", moderate: "☆☆", plenty: "☆☆☆" };
  return stars[density];
}
