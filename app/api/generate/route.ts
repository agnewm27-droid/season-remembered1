import { buildPrompt, SYSTEM_PROMPT } from "@/lib/prompts";
import type { PlayerInput, TeamData } from "@/lib/types";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Body = {
  teamData: TeamData;
  players: PlayerInput[];
};

function isPlayerInput(p: unknown): p is PlayerInput {
  if (!p || typeof p !== "object") return false;
  const o = p as Record<string, unknown>;
  return (
    typeof o.name === "string" &&
    typeof o.number === "string" &&
    typeof o.position === "string" &&
    typeof o.stat === "string" &&
    typeof o.fact1 === "string" &&
    typeof o.fact2 === "string" &&
    typeof o.fact3 === "string" &&
    typeof o.parentQuote === "string"
  );
}

function isTeamData(t: unknown): t is TeamData {
  if (!t || typeof t !== "object") return false;
  const o = t as Record<string, unknown>;
  return (
    typeof o.teamName === "string" &&
    typeof o.sport === "string" &&
    typeof o.coachName === "string" &&
    typeof o.season === "string" &&
    typeof o.record === "string"
  );
}

export async function POST(request: Request) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "Server is not configured with ANTHROPIC_API_KEY." },
      { status: 500 }
    );
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!isTeamData(body.teamData) || !Array.isArray(body.players)) {
    return NextResponse.json({ error: "Invalid request shape." }, { status: 400 });
  }

  const players = body.players.filter((p) => isPlayerInput(p) && p.name.trim());
  if (players.length === 0) {
    return NextResponse.json(
      { error: "At least one player with a name is required." },
      { status: 400 }
    );
  }

  const userContent = buildPrompt(body.teamData, players);

  const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8192,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userContent }],
    }),
  });

  const data = (await anthropicRes.json()) as {
    content?: Array<{ type: string; text?: string }>;
    error?: { message?: string };
  };

  if (!anthropicRes.ok) {
    const msg =
      data.error?.message ?? `Anthropic API error (${anthropicRes.status})`;
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  const text = (data.content ?? [])
    .map((b) => (b.type === "text" ? b.text ?? "" : ""))
    .join("");
  const clean = text.replace(/```json|```/g, "").trim();

  let profiles: Record<string, string>;
  try {
    profiles = JSON.parse(clean) as Record<string, string>;
  } catch {
    return NextResponse.json(
      { error: "Could not parse model response as JSON." },
      { status: 502 }
    );
  }

  return NextResponse.json({ profiles });
}
