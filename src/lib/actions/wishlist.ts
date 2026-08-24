"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getWishlist(userId: string) {
  return prisma.wishlistItem.findMany({
    where: { userId },
    include: {
      product: {
        include: {
          images: { orderBy: { order: "asc" }, take: 1 },
          category: true,
          reviews: { where: { status: "APPROVED" }, select: { rating: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function toggleWishlist(userId: string, productId: string) {
  const existing = await prisma.wishlistItem.findUnique({
    where: { userId_productId: { userId, productId } },
  });

  if (existing) {
    await prisma.wishlistItem.delete({ where: { id: existing.id } });
    revalidatePath("/wishlist");
    return { added: false };
  }

  await prisma.wishlistItem.create({
    data: { userId, productId },
  });

  revalidatePath("/wishlist");
  return { added: true };
}

export async function isInWishlist(userId: string, productId: string) {
  const item = await prisma.wishlistItem.findUnique({
    where: { userId_productId: { userId, productId } },
  });
  return !!item;
}

export async function getWishlistIds(userId: string): Promise<string[]> {
  const items = await prisma.wishlistItem.findMany({
    where: { userId },
    select: { productId: true },
  });
  return items.map((i) => i.productId);
}
