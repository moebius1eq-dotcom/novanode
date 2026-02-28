import { NextResponse } from "next/server";
import { readModerationQueue } from "@/lib/moderationQueue";

export async function GET() {
  const all = await readModerationQueue();
  const high = all.filter((x) => x.risk === "high").length;
  const medium = all.filter((x) => x.risk === "medium").length;

  return NextResponse.json({
    total: all.length,
    high,
    medium,
    items: all.slice(0, 100),
  });
}
