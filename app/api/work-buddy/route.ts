import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { clientKey, isRateLimited } from "@/lib/rateLimit";
import { scoreRisk } from "@/lib/moderation";
import { appendModerationRecord } from "@/lib/moderationQueue";

interface WorkBuddy {
  spotId: string;
  until: string;
  createdAt: string;
}

const filePath = path.join(process.cwd(), "data", "work-buddy.json");

async function readAll(): Promise<WorkBuddy[]> {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8")) as WorkBuddy[];
  } catch {
    return [];
  }
}

function active(items: WorkBuddy[]) {
  const now = Date.now();
  return items.filter((x) => new Date(x.until).getTime() > now);
}

export async function GET(request: NextRequest) {
  const spotId = new URL(request.url).searchParams.get("spotId");
  if (!spotId) return NextResponse.json({ error: "spotId required" }, { status: 400 });

  const items = active(await readAll()).filter((x) => x.spotId === spotId);
  return NextResponse.json({ count: items.length });
}

export async function POST(request: NextRequest) {
  const key = clientKey(request.headers.get("x-forwarded-for"), "work-buddy");
  const tooFrequent = isRateLimited(key, 30, 60 * 60 * 1000);
  if (tooFrequent) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const body = (await request.json()) as Partial<WorkBuddy>;
  if (!body.spotId || !body.until) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const moderation = scoreRisk({ text: `${body.spotId}:${body.until}`, tooFrequent });
  if (moderation.risk !== "low") {
    await appendModerationRecord({
      kind: "work_buddy_update",
      risk: moderation.risk,
      reasons: moderation.reasons,
      payload: { spotId: body.spotId, until: body.until },
    });
  }

  const entry: WorkBuddy = { spotId: body.spotId, until: body.until, createdAt: new Date().toISOString() };
  const items = active(await readAll());
  items.unshift(entry);
  await fs.writeFile(filePath, JSON.stringify(items.slice(0, 5000), null, 2), "utf8");

  return NextResponse.json({ ok: true });
}
