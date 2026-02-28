import { WorkSpot } from "@/lib/types";

export function getWorkMoodTags(spot: WorkSpot): string[] {
  const tags: string[] = [];

  const isQuiet = spot.logistics.noiseLevel <= 50;
  const hasBooths = spot.hasZoomPods || spot.logistics.seatingType.includes("private-booths");
  const hasCommunal = spot.logistics.seatingType.includes("communal");
  const hasParking = spot.parkingStatus === "free-garage" || (spot.parkingInfo?.toLowerCase().includes("free") ?? false);
  const biophilicSignal = spot.vibe.tags.some((tag) =>
    ["outdoor", "natural-light", "plants", "rooftop", "park"].includes(tag),
  );

  if (isQuiet || hasBooths || spot.vibe.primary === "quiet" || spot.vibe.primary === "focus") {
    tags.push("#DeepWork");
  }
  if (hasCommunal || spot.vibe.primary === "social" || spot.logistics.noiseLevel >= 65) {
    tags.push("#SocialCollab");
  }
  if ((spot.meetingFriendly ?? false) || hasBooths || hasParking) {
    tags.push("#ClientReady");
  }
  if (biophilicSignal) {
    tags.push("#Biophilic");
  }

  if (tags.length === 0) {
    tags.push("#DeepWork");
  }

  return tags;
}

export function getMeetingReadyScore(spot: WorkSpot): number {
  if (typeof spot.zoomScore === "number") {
    return Math.max(1, Math.min(5, Math.round(spot.zoomScore / 2)));
  }

  let score = 3;
  if (spot.logistics.noiseLevel <= 45) score += 1;
  if (spot.logistics.noiseLevel >= 70) score -= 1;
  if (spot.hasZoomPods || spot.logistics.seatingType.includes("private-booths")) score += 1;
  if (spot.vibe.primary === "social") score -= 1;

  return Math.max(1, Math.min(5, score));
}

export function getAcousticLabel(spot: WorkSpot): string {
  if (spot.hasZoomPods || spot.logistics.seatingType.includes("private-booths")) {
    return "Soundproof booths available";
  }

  if (spot.logistics.noiseLevel <= 45) {
    return "Quiet zone (library-like)";
  }

  if (spot.logistics.noiseLevel >= 70 || spot.vibe.primary === "social") {
    return "Social hub (expect interruptions)";
  }

  return "Moderate ambient noise";
}
