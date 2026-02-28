import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

interface SpeedSubmission {
  spotId: string;
  spotSlug: string;
  spotName: string;
  neighborhood: string;
  latencyMs: number;
  downloadMbps: number;
  uploadMbps: number;
  createdAt: string;
}

const filePath = path.join(process.cwd(), "data", "speed-submissions.json");

async function readSubmissions(): Promise<SpeedSubmission[]> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as SpeedSubmission[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function median(values: number[]) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const value = sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
  return Number(value.toFixed(1));
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const spotId = searchParams.get("spotId");

  if (!spotId) {
    return NextResponse.json({ error: "spotId is required" }, { status: 400 });
  }

  const all = await readSubmissions();
  const recent = all.filter((s) => s.spotId === spotId).slice(0, 100);

  return NextResponse.json(
    {
      count: recent.length,
      medianDownloadMbps: median(recent.map((s) => s.downloadMbps)),
      medianUploadMbps: median(recent.map((s) => s.uploadMbps)),
      medianLatencyMs: median(recent.map((s) => s.latencyMs)),
      latestAt: recent[0]?.createdAt ?? null,
    },
    { status: 200 },
  );
}

export async function POST(request: NextRequest) {
  try {
    const data = (await request.json()) as Partial<SpeedSubmission>;

    if (!data.spotId || !data.spotSlug || !data.spotName || !data.neighborhood) {
      return NextResponse.json({ error: "Missing spot fields" }, { status: 400 });
    }

    const latencyMs = Number(data.latencyMs ?? 0);
    const downloadMbps = Number(data.downloadMbps ?? 0);
    const uploadMbps = Number(data.uploadMbps ?? 0);

    if (latencyMs <= 0 || downloadMbps <= 0 || uploadMbps <= 0) {
      return NextResponse.json({ error: "Invalid speed values" }, { status: 400 });
    }

    const entry: SpeedSubmission = {
      spotId: data.spotId,
      spotSlug: data.spotSlug,
      spotName: data.spotName,
      neighborhood: data.neighborhood,
      latencyMs,
      downloadMbps,
      uploadMbps,
      createdAt: new Date().toISOString(),
    };

    const existing = await readSubmissions();
    existing.unshift(entry);
    await fs.writeFile(filePath, JSON.stringify(existing.slice(0, 1000), null, 2), "utf8");

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to save submission" }, { status: 500 });
  }
}
