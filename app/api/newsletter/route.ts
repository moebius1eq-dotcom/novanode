import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { clientKey, isRateLimited } from "@/lib/rateLimit";
import { scoreRisk } from "@/lib/moderation";
import { appendModerationRecord } from "@/lib/moderationQueue";

const filePath = path.join(process.cwd(), "data", "newsletter-signups.json");

export async function POST(request: NextRequest) {
  const key = clientKey(request.headers.get("x-forwarded-for"), "newsletter");
  const tooFrequent = isRateLimited(key, 10, 60 * 60 * 1000);
  if (tooFrequent) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const { email } = (await request.json()) as { email?: string };
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const moderation = scoreRisk({ text: email, tooFrequent });
    if (moderation.risk !== "low") {
      await appendModerationRecord({
        kind: "newsletter_signup",
        risk: moderation.risk,
        reasons: moderation.reasons,
        payload: { email },
      });
    }

    let list: string[] = [];
    try {
      list = JSON.parse(await fs.readFile(filePath, "utf8")) as string[];
    } catch {}

    if (!list.includes(email)) list.unshift(email);
    await fs.writeFile(filePath, JSON.stringify(list.slice(0, 5000), null, 2), "utf8");

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}
