import { WorkSpot } from "@/lib/types";

export const VERIFIED_SPOT_SLUGS = new Set([
  "northside-social",
  "3den-tysons",
  "mishas-coffee-alexandria",
  "caboose-commons",
  "arlington-central-library",
  "reston-regional-library",
  "beatley-library-alexandria",
  "capital-one-hall",
  "the-perch-tysons",
  "compass-coffee-rosslyn",
  "three-whistles",
]);

export function filterVerifiedSpots(spots: WorkSpot[]): WorkSpot[] {
  return spots.filter((spot) => VERIFIED_SPOT_SLUGS.has(spot.slug));
}
