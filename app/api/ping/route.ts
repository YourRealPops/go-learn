import { NextResponse } from "next/server";

const GO_BACKEND_URL = process.env.GO_BACKEND_URL ?? "http://localhost:8080";

export async function GET() {
  try {
    const res = await fetch(`${GO_BACKEND_URL}/health`, {
      signal: AbortSignal.timeout(10_000),
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ status: "backend sleeping" }, { status: 503 });
  }
}