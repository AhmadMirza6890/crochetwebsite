"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { unlink } from "fs/promises";
import path from "path";

export async function getMedia() {
  try {
    // Never select the binary payload here — only metadata for the grid
    return await prisma.media.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        url: true,
        filename: true,
        alt: true,
        mimeType: true,
        size: true,
        folder: true,
        createdAt: true,
      },
    });
  } catch {
    return [];
  }
}

export async function deleteMedia(id: string) {
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) throw new Error("Media not found");

  // Legacy uploads lived on the local disk — clean those up too.
  // New uploads live in Postgres, so deleting the row removes the bytes.
  if (media.url.startsWith("/uploads/")) {
    try {
      const filePath = path.join(process.cwd(), "public", media.url);
      await unlink(filePath);
    } catch {
      // file may already be gone — still remove the record
    }
  }

  await prisma.media.delete({ where: { id } });
  revalidatePath("/admin/media");
}
