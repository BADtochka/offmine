import { NextRequest, NextResponse } from "next/server";
import { status } from "minecraft-server-util";

const headers = { "Cache-Control": "public, max-age=60, stale-while-revalidate=30" };

async function fromPackage(ip: string) {
  const result = await status(ip, 25565, { timeout: 5000 });
  return {
    online: true,
    players: { online: result.players.online, max: result.players.max },
    version: result.version.name,
  };
}

async function fromMcsrvstat(ip: string) {
  const res = await fetch(`https://api.mcsrvstat.us/3/${ip}`, {
    signal: AbortSignal.timeout(6000),
  });
  if (!res.ok) throw new Error("mcsrvstat error");
  const data = await res.json();
  if (!data.online) return { online: false };
  return {
    online: true,
    players: { online: data.players?.online ?? 0, max: data.players?.max ?? 0 },
    version: data.version ?? undefined,
  };
}

export async function GET(req: NextRequest) {
  const ip = req.nextUrl.searchParams.get("ip");
  if (!ip) {
    return NextResponse.json({ error: "ip required" }, { status: 400 });
  }

  try {
    return NextResponse.json(await fromPackage(ip), { headers });
  } catch {
    try {
      return NextResponse.json(await fromMcsrvstat(ip), { headers });
    } catch {
      return NextResponse.json({ online: false }, { headers });
    }
  }
}
