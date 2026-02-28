import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { clientKey, isRateLimited } from "@/lib/rateLimit";
import { scoreRisk } from "@/lib/moderation";
import { appendModerationRecord } from "@/lib/moderationQueue";

type SeatState = "plenty" | "busy" | "full";

interface SeatReport {
  spotId: string;
  state: SeatState;
  createdAt: string;
}

const filePath = path.join(process.cwd(), "data", "seat-reports.json");
const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

async function readReports(): Promise<SeatReport[]> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as SeatReport[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function withinTwoHours(report: SeatReport) {
  return Date.now() - new Date(report.createdAt).getTime() <= TWO_HOURS_MS;
}

function aggregateState(reports: SeatReport[]): SeatState | null {
  if (reports.length === 0) return null;

  const counts = reports.reduce(
    (acc, report) => {
      acc[report.state] += 1;
      return acc;
    },
    { plenty: 0, busy: 0, full: 0 },
  );

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return sorted[0][0] as SeatState;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const spotId = searchParams.get("spotId");

  if (!spotId) {
    return NextResponse.json({ error: "spotId is required" }, { status: 400 });
  }

  const all = await readReports();
  const active = all.filter((report) => report.spotId === spotId && withinTwoHours(report));

  return NextResponse.json(
    {
      count: active.length,
      currentState: aggregateState(active),
      expiresInMinutes: active.length > 0
        ? Math.max(0, Math.round((TWO_HOURS_MS - (Date.now() - new Date(active[0].createdAt).getTime())) / 60000))
        : 0,
    },
    { status: 200 },
  );
}

export async function POST(request: NextRequest) {
  const key = clientKey(request.headers.get("x-forwarded-for"), "seat-status");
  const tooFrequent = isRateLimited(key, 20, 60 * 60 * 1000);
  if (tooFrequent) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const body = (await request.json()) as Partial<SeatReport>;

    if (!body.spotId || !body.state || !["plenty", "busy", "full"].includes(body.state)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const report: SeatReport = {
      spotId: body.spotId,
      state: body.state,
      createdAt: new Date().toISOString(),
    };

    const moderation = scoreRisk({ text: `${body.spotId}:${body.state}`, tooFrequent });
    if (moderation.risk !== "low") {
      await appendModerationRecord({
        kind: "seat_status_report",
        risk: moderation.risk,
        reasons: moderation.reasons,
        payload: { spotId: body.spotId, state: body.state },
      });
    }

    const existing = await readReports();
    const filtered = existing.filter(withinTwoHours);
    filtered.unshift(report);

    await fs.writeFile(filePath, JSON.stringify(filtered.slice(0, 2000), null, 2), "utf8");

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to save report" }, { status: 500 });
  }
}
