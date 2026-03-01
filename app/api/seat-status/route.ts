import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { clientKey, isRateLimited } from "@/lib/rateLimit";
import { getSupabaseServer, isSupabaseConfigured } from "@/lib/supabaseServer";

type SeatState = "plenty" | "busy" | "full";
interface SeatReport { spotId: string; state: SeatState; createdAt: string; }

const filePath = path.join(process.cwd(), "data", "seat-reports.json");
const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

async function readReports(): Promise<SeatReport[]> {
  try { return JSON.parse(await fs.readFile(filePath, "utf8")) as SeatReport[]; } catch { return []; }
}
function withinTwoHours(report: SeatReport) { return Date.now() - new Date(report.createdAt).getTime() <= TWO_HOURS_MS; }
function aggregateState(reports: SeatReport[]): SeatState | null {
  if (!reports.length) return null;
  const counts = reports.reduce((a, r) => ({ ...a, [r.state]: a[r.state] + 1 }), { plenty: 0, busy: 0, full: 0 });
  return (Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] as SeatState) ?? null;
}

export async function GET(request: NextRequest) {
  const spotId = new URL(request.url).searchParams.get("spotId");
  if (!spotId) return NextResponse.json({ error: "spotId is required" }, { status: 400 });

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseServer();
    const since = new Date(Date.now() - TWO_HOURS_MS).toISOString();
    const { data, error } = await supabase!
      .from("seat_reports")
      .select("state,created_at")
      .eq("spot_id", spotId)
      .gte("created_at", since)
      .order("created_at", { ascending: false });
    if (!error && data) {
      const mapped = data.map((d) => ({ spotId, state: d.state as SeatState, createdAt: d.created_at as string }));
      return NextResponse.json({ count: mapped.length, currentState: aggregateState(mapped), expiresInMinutes: 120 });
    }
  }

  const active = (await readReports()).filter((r) => r.spotId === spotId && withinTwoHours(r));
  return NextResponse.json({ count: active.length, currentState: aggregateState(active), expiresInMinutes: active.length ? 120 : 0 });
}

export async function POST(request: NextRequest) {
  const key = clientKey(request.headers.get("x-forwarded-for"), "seat-status");
  if (isRateLimited(key, 20, 60 * 60 * 1000)) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

  try {
    const body = (await request.json()) as Partial<SeatReport>;
    if (!body.spotId || !body.state || !["plenty", "busy", "full"].includes(body.state)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServer();
      const { error } = await supabase!.from("seat_reports").insert({ spot_id: body.spotId, state: body.state });
      if (!error) return NextResponse.json({ ok: true });
    }

    const existing = (await readReports()).filter(withinTwoHours);
    existing.unshift({ spotId: body.spotId, state: body.state as SeatState, createdAt: new Date().toISOString() });
    await fs.writeFile(filePath, JSON.stringify(existing.slice(0, 2000), null, 2), "utf8");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to save report" }, { status: 500 });
  }
}
