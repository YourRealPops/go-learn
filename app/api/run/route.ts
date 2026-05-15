import { NextRequest, NextResponse } from "next/server";

const GO_BACKEND_URL = process.env.GO_BACKEND_URL ?? "https://play.golang.org";

export async function POST(req: NextRequest) {
  const { code, lessonSlug } = await req.json();

  if (!code || typeof code !== "string") {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  // MVP: use the official Go Playground API
  // When your Go backend is ready, swap this for:
  // const res = await fetch(`${GO_BACKEND_URL}/api/run`, { method: "POST", ... })
  try {
    const res = await fetch("https://play.golang.org/run", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ version: "2", body: code }),
      signal: AbortSignal.timeout(15_000),
    });

    if (!res.ok) {
      return NextResponse.json({ error: `Playground error: ${res.status}` }, { status: 502 });
    }

    const data = await res.json();

    // Go Playground returns { Errors, Events: [{Message, Kind}] }
    if (data.Errors) {
      return NextResponse.json({ output: data.Errors, isError: true });
    }

    const output = (data.Events ?? [])
      .map((e: { Message: string }) => e.Message)
      .join("");

    return NextResponse.json({ output: output || "(no output)" });
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      return NextResponse.json({ error: "Execution timed out (15s limit)" }, { status: 504 });
    }
    return NextResponse.json({ error: "Runner unavailable" }, { status: 503 });
  }
}