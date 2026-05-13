import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { error: "Roadmaps are returned by /api/ingest." },
    { status: 404 }
  );
}
