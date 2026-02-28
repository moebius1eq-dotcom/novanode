import { Neighborhood, WorkSpot } from "@/lib/types";

export const FEATURED_SPOT_BY_NEIGHBORHOOD: Partial<Record<Neighborhood, string>> = {
  arlington: "northside-social",
  alexandria: "mishas-coffee-alexandria",
  tysons: "caboose-commons",
  reston: "reston-roasters",
};

export function isFeaturedSpot(spot: WorkSpot): boolean {
  return FEATURED_SPOT_BY_NEIGHBORHOOD[spot.neighborhood] === spot.slug;
}

export function shouldShowDayPassPartner(spot: WorkSpot): boolean {
  return (
    spot.vibe.tags.includes("paid-lounge") ||
    spot.vibe.tags.includes("coworking") ||
    !!spot.hasZoomPods ||
    !!spot.meetingFriendly
  );
}

export function shouldShowOutletAffiliate(spot: WorkSpot): boolean {
  return spot.logistics.outletDensity === "sparse" || spot.logistics.outletDensity === "moderate";
}
