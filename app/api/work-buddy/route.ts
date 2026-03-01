import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { clientKey, isRateLimited } from "@/lib/rateLimit";
import { getSupabaseServer, isSupabaseConfigured } from "@/lib/supabaseServer";

interface WorkBuddy { spotId: string; until: string; createdAt: string; }
const filePath = path.join(process.cwd(), "data", "work-buddy.json");

async function readAll(): Promise<WorkBuddy[]> {
  try { return JSON.parse(await fs.readFile(filePath, "utf8")) as WorkBuddy[]; } catch { return []; }
}

function active(items: WorkBuddy[]) {
  const now = Date.now();
  return items.filter((x) => new Date(x.until).getTime() > now);
}

export async function GET(request: NextRequest) {
  const spotId = new URL(request.url).searchParams.get("spotId");
  if (!spotId) return NextResponse.json({ error: "spotId required" }, { status: 400 });

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseServer();
    const now = new Date().toISOString();
    const { data, error } = await supabase!
      .from("work_buddy_signals")
      .select("id")
      .eq("spot_id", spotId)
      .gt("until_at", now);
    if (!error && data) return NextResponse.json({ count: data.length });
  }

  return NextResponse.json({ count: active(await readAll()).filter((x) => x.spotId === spotId).length });
}

export async function POST(request: NextRequest) {
  const key = clientKey(request.headers.get("x-forwarded-for"), "work-buddy");
  if (isRateLimited(key, 30, 60 * 60 * 1000)) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

  const body = (await request.json()) as Partial<WorkBuddy>;
  if (!body.spotId || !body.until) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseServer();
    const { error } = await supabase!.from("work_buddy_signals").insert({ spot_id: body.spotId, until_at: body.until });
    if (!error) return NextResponse.json({ ok: true });
  }

  const items = active(await readAll());
  items.unshift({ spotId: body.spotId, until: body.until, createdAt: new Date().toISOString() });
  await fs.writeFile(filePath, JSON.stringify(items.slice(0, 5000), null, 2), "utf8");
  return NextResponse.json({ ok: true });
}
