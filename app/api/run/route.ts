import { NextRequest, NextResponse } from "next/server";

const GO_BACKEND_URL = process.env.GO_BACKEND_URL ?? "http://localhost:8080";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const backendUrl = process.env.GO_BACKEND_URL ?? "http://localhost:8080";
  console.log("Proxying to:", `${backendUrl}/api/run`);
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

    // Read as text first to debug
    const text = await res.text();

    // Try to parse as JSON
    try {
      const data = JSON.parse(text);
      return NextResponse.json(data, { status: res.ok ? 200 : res.status });
    } catch {
      // If not JSON, return the raw text as output
      return NextResponse.json({ output: text, isError: !res.ok });
    }
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      return NextResponse.json({ error: "Execution timed out" }, { status: 504 });
    }
    return NextResponse.json({ error: "Backend unavailable" }, { status: 503 });
  }
}