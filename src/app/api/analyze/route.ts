import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { error: "Use /api/ingest to analyze a repository." },
    { status: 404 }
  );
}
