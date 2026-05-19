import { NextRequest, NextResponse } from "next/server";

const GO_BACKEND_URL = process.env.GO_BACKEND_URL ?? "http://localhost:8080";

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Forward the token if present (for authenticated runs in the future)
  const authHeader = req.headers.get("authorization") ?? "";

  try {
    const res = await fetch(`${GO_BACKEND_URL}/api/run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(20_000),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.ok ? 200 : res.status });
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      return NextResponse.json({ error: "Execution timed out" }, { status: 504 });
    }
    return NextResponse.json({ error: "Backend unavailable" }, { status: 503 });
  }
}