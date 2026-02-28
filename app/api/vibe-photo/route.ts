import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { clientKey, isRateLimited } from "@/lib/rateLimit";
import { scoreRisk } from "@/lib/moderation";
import { appendModerationRecord } from "@/lib/moderationQueue";

interface VibePhoto {
  spotId: string;
  url: string;
  createdAt: string;
}

const dataPath = path.join(process.cwd(), "data", "vibe-photos.json");
const uploadDir = path.join(process.cwd(), "public", "uploads");

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
  const items = (await readAll()).filter((x) => x.spotId === spotId).slice(0, 1);
  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  const key = clientKey(request.headers.get("x-forwarded-for"), "vibe-photo");
  const tooFrequent = isRateLimited(key, 10, 60 * 60 * 1000);
  if (tooFrequent) {
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
  await fs.mkdir(uploadDir, { recursive: true });
  const ext = file.name.split(".").pop() || "jpg";
  const name = `${spotId}-${Date.now()}.${ext}`;
  const fullPath = path.join(uploadDir, name);
  await fs.writeFile(fullPath, bytes);

  const moderation = scoreRisk({ fileSizeBytes: file.size, tooFrequent, text: spotId });
  if (moderation.risk !== "low") {
    await appendModerationRecord({
      kind: "vibe_photo_upload",
      risk: moderation.risk,
      reasons: moderation.reasons,
      payload: { spotId, fileType: file.type, fileSize: file.size },
    });
  }

  const record: VibePhoto = { spotId, url: `/uploads/${name}`, createdAt: new Date().toISOString() };
  const all = await readAll();
  const filtered = all.filter((x) => x.spotId !== spotId);
  filtered.unshift(record);
  await fs.writeFile(dataPath, JSON.stringify(filtered.slice(0, 2000), null, 2), "utf8");

  return NextResponse.json({ ok: true, url: record.url });
}
