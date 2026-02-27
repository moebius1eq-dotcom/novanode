// lib/constants.ts

import { Neighborhood, VibePrimary } from "./types";

export const NEIGHBORHOODS: Record<Neighborhood, string> = {
  arlington: "Arlington",
  alexandria: "Alexandria",
  tysons: "Tysons",
  reston: "Reston",
};

export const NEIGHBORHOOD_SLUGS: Neighborhood[] = ["arlington", "alexandria", "tysons", "reston"];

export const VIBE_COLORS: Record<VibePrimary, { bg: string; text: string; border: string }> = {
  focus: { bg: "bg-green-100", text: "text-green-800", border: "border-green-500" },
  social: { bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-500" },
  quiet: { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-500" },
  lively: { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-500" },
};

export const VIBE_LABELS: Record<VibePrimary, string> = {
  focus: "Focus Zone",
  social: "Social / Loud",
  quiet: "Quiet / Library",
  lively: "Lively / Energetic",
};

export const OUTLET_DENSITY_LABELS: Record<string, string> = {
  sparse: "Sparse",
  moderate: "Moderate",
  plenty: "Plenty",
};

export const SEATING_TYPE_LABELS: Record<string, string> = {
  desk: "Desks",
  couch: "Couches",
  bar: "Bar Seating",
  communal: "Communal Tables",
  outdoor: "Outdoor",
};

export const NOISE_LEVELS = {
  quiet: { max: 45, label: "Quiet", color: "text-green-600" },
  moderate: { max: 70, label: "Moderate", color: "text-yellow-600" },
  loud: { max: 100, label: "Loud", color: "text-red-600" },
};
