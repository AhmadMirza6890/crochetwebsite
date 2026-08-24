import { NextRequest, NextResponse } from "next/server";
import path from "path";
import prisma from "@/lib/prisma";

// Store uploads directly in Postgres (Media.data) and serve them via
// /api/images/[id]. This works identically in local dev and on read-only
// hosting like Vercel, with no external storage service required.
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    // Vercel functions cap request bodies around 4.5MB
    const MAX_BYTES = 4 * 1024 * 1024;
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "Image is too large (max 4MB)" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const ext = path.extname(file.name);
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9]/g, "-").slice(0, 40);
    const uniqueName = `${baseName || "image"}-${Date.now()}${ext}`;

    const record = await prisma.media.create({
      data: {
        url: "",
        filename: uniqueName,
        mimeType: file.type,
        size: buffer.length,
        data: buffer,
      },
    });

    const url = `/api/images/${record.id}`;
    await prisma.media.update({ where: { id: record.id }, data: { url } });

    return NextResponse.json({ url, filename: uniqueName, size: file.size });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
