import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.arrayBuffer();
  return NextResponse.json({ receivedBytes: body.byteLength }, { status: 200 });
}
