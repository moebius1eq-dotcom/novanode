import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

async function readJsonArray(file: string) {
  try {
    const raw = await fs.readFile(path.join(process.cwd(), "data", file), "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function GET() {
  const [speed, seats, vibes, newsletter, buddies, moderation] = await Promise.all([
    readJsonArray("speed-submissions.json"),
    readJsonArray("seat-reports.json"),
    readJsonArray("vibe-photos.json"),
    readJsonArray("newsletter-signups.json"),
    readJsonArray("work-buddy.json"),
    readJsonArray("moderation-queue.json"),
  ]);

  return NextResponse.json({
    speedSubmissions: speed.length,
    seatReports: seats.length,
    vibePhotos: vibes.length,
    newsletterSignups: newsletter.length,
    workBuddySignals: buddies.length,
    moderationQueue: moderation.length,
  });
}
