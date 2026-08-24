"use server";

import prisma from "@/lib/prisma";
import { reviewSchema, type ReviewInput } from "@/lib/validators";
import { revalidatePath } from "next/cache";
import { revalidateStorefront } from "@/lib/revalidate";

export async function getReviews(params?: {
  productId?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const { productId, status, page = 1, limit = 20 } = params || {};

    const where: Record<string, unknown> = {};
    if (productId) where.productId = productId;
    if (status) where.status = status;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          user: { select: { name: true, image: true } },
          product: { select: { name: true, slug: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.review.count({ where }),
    ]);

    return { reviews, total, pages: Math.ceil(total / limit), page };
  } catch {
    return { reviews: [], total: 0, pages: 1, page: 1 };
  }
}

export async function createReview(
  userId: string,
  data: ReviewInput
) {
  const validated = reviewSchema.parse(data);

  // Check if user already reviewed this product
  const existing = await prisma.review.findUnique({
    where: { userId_productId: { userId, productId: validated.productId } },
  });
  if (existing) throw new Error("You already reviewed this product");

  // Check if user purchased this product
  const purchased = await prisma.orderItem.findFirst({
    where: {
      productId: validated.productId,
      order: { userId, status: "DELIVERED" },
    },
  });

  const review = await prisma.review.create({
    data: {
      userId,
      productId: validated.productId,
      rating: validated.rating,
      title: validated.title,
      comment: validated.comment,
      isVerified: !!purchased,
    },
  });

  await prisma.notification.create({
    data: {
      title: "New Review",
      message: `New ${validated.rating}-star review submitted`,
      type: "review",
      link: `/admin/reviews`,
    },
  });

  revalidateStorefront();
  revalidatePath("/admin/reviews");

  return review;
}

export async function updateReviewStatus(id: string, status: string) {
  await prisma.review.update({
    where: { id },
    data: { status: status as never },
  });

  revalidatePath("/admin/reviews");
  revalidateStorefront();
}

export async function deleteReview(id: string) {
  await prisma.review.delete({ where: { id } });
  revalidatePath("/admin/reviews");
  revalidateStorefront();
}
