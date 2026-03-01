import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { clientKey, isRateLimited } from "@/lib/rateLimit";
import { getSupabaseServer, isSupabaseConfigured } from "@/lib/supabaseServer";

interface VibePhoto {
  spotId: string;
  url: string;
  createdAt: string;
}

const dataPath = path.join(process.cwd(), "data", "vibe-photos.json");
const uploadDir = path.join(process.cwd(), "public", "uploads");
const SUPABASE_BUCKET = "vibe-photos";

async function readAll(): Promise<VibePhoto[]> {
  try {
    return JSON.parse(await fs.readFile(dataPath, "utf8")) as VibePhoto[];
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  const spotId = new URL(request.url).searchParams.get("spotId");
  if (!spotId) return NextResponse.json({ error: "spotId required" }, { status: 400 });

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase!
      .from("vibe_photos")
      .select("url,created_at")
      .eq("spot_id", spotId)
      .order("created_at", { ascending: false })
      .limit(1);

    if (!error && data) {
      return NextResponse.json({
        items: data.map((d) => ({ url: d.url as string, createdAt: d.created_at as string })),
      });
    }
  }

  return NextResponse.json({ items: (await readAll()).filter((x) => x.spotId === spotId).slice(0, 1) });
}

export async function POST(request: NextRequest) {
  const key = clientKey(request.headers.get("x-forwarded-for"), "vibe-photo");
  if (isRateLimited(key, 10, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const form = await request.formData();
  const spotId = String(form.get("spotId") || "");
  const file = form.get("file") as File | null;
  if (!spotId || !file) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }
  if (file.size > 2 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 2MB)" }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = file.name.split(".").pop() || "jpg";
  const objectName = `${spotId}/${Date.now()}.${ext}`;

  let url = "";

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseServer();

    const { error: uploadError } = await supabase!.storage
      .from(SUPABASE_BUCKET)
      .upload(objectName, bytes, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json(
        {
          error: `Supabase storage upload failed: ${uploadError.message}`,
          hint: `Create a public storage bucket named '${SUPABASE_BUCKET}' in Supabase Storage.`,
        },
        { status: 500 },
      );
    }

    const { data: publicUrlData } = supabase!.storage.from(SUPABASE_BUCKET).getPublicUrl(objectName);
    url = publicUrlData.publicUrl;

    const { error: dbError } = await supabase!.from("vibe_photos").insert({
      spot_id: spotId,
      url,
    });

    if (dbError) {
      return NextResponse.json({ error: `Supabase DB insert failed: ${dbError.message}` }, { status: 500 });
    }

    return NextResponse.json({ ok: true, url });
  }

  await fs.mkdir(uploadDir, { recursive: true });
  const localName = `${spotId}-${Date.now()}.${ext}`;
  const fullPath = path.join(uploadDir, localName);
  await fs.writeFile(fullPath, bytes);
  url = `/uploads/${localName}`;

  const all = await readAll();
  const filtered = all.filter((x) => x.spotId !== spotId);
  filtered.unshift({ spotId, url, createdAt: new Date().toISOString() });
  await fs.writeFile(dataPath, JSON.stringify(filtered.slice(0, 2000), null, 2), "utf8");

  return NextResponse.json({ ok: true, url });
}
