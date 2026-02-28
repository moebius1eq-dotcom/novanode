import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sizeMb = Math.min(Math.max(Number(searchParams.get("sizeMb") ?? "5"), 1), 20);
  const sizeBytes = sizeMb * 1024 * 1024;

  const payload = Buffer.alloc(sizeBytes, "a");

  return new Response(payload, {
    status: 200,
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Length": String(sizeBytes),
      "Cache-Control": "no-store",
    },
  });
}
