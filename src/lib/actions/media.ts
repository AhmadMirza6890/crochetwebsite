"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { unlink } from "fs/promises";
import path from "path";

export async function getMedia() {
  try {
    return await prisma.media.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    return [];
  }
}

export async function deleteMedia(id: string) {
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) throw new Error("Media not found");

  // Remove the physical file for locally uploaded images
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
