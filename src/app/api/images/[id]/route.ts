import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Images live in Postgres; long-cache them since each upload gets a unique id.
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const media = await prisma.media.findUnique({
      where: { id },
      select: { data: true, mimeType: true },
    });

    if (!media?.data) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    return new Response(new Uint8Array(media.data), {
      headers: {
        "Content-Type": media.mimeType || "application/octet-stream",
        "Content-Length": String(media.data.length),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to load image" }, { status: 500 });
  }
}
