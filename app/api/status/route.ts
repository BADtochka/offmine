import { NextRequest, NextResponse } from "next/server";
import { status } from "minecraft-server-util";

export async function GET(req: NextRequest) {
  const ip = req.nextUrl.searchParams.get("ip");
  if (!ip) {
    return NextResponse.json({ error: "ip required" }, { status: 400 });
  }

  const headers = { "Cache-Control": "public, max-age=60, stale-while-revalidate=30" };

  try {
    const result = await status(ip, 25565, { timeout: 5000 });
    return NextResponse.json(
      {
        online: true,
        players: {
          online: result.players.online,
          max: result.players.max,
        },
        version: result.version.name,
      },
      { headers }
    );
  } catch {
    return NextResponse.json({ online: false }, { headers });
  }
}
