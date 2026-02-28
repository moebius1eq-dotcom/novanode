import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const q = new URL(request.url).searchParams.get("q");
  if (!q) return NextResponse.json({ item: null });

  try {
    const redditUrl = `https://www.reddit.com/search.json?q=${encodeURIComponent(q + " remote work")}&limit=1&sort=new`;
    const res = await fetch(redditUrl, { headers: { "User-Agent": "NoVaNode/1.0" }, cache: "no-store" });
    if (!res.ok) return NextResponse.json({ item: null });
    const data = await res.json() as any;
    const child = data?.data?.children?.[0]?.data;
    if (!child) return NextResponse.json({ item: null });

    return NextResponse.json({
      item: {
        title: child.title,
        url: `https://reddit.com${child.permalink}`,
        source: "Reddit",
      },
    });
  } catch {
    return NextResponse.json({ item: null });
  }
}
