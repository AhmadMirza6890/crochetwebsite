"use server";

import prisma from "@/lib/prisma";
import { categorySchema, type CategoryInput } from "@/lib/validators";
import { revalidatePath } from "next/cache";
import { revalidateStorefront } from "@/lib/revalidate";

const defaultCategories = [
  {
    id: "cat-1",
    name: "Crochet Bags",
    slug: "crochet-bags",
    description: "Artisanal shoulder bags, granny square totes, and delicate wristlets.",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800",
    order: 0,
    isActive: true,
    _count: { products: 4 },
  },
  {
    id: "cat-2",
    name: "Crochet Flowers",
    slug: "crochet-flowers",
    description: "Everlasting hand-stitched tulips, daisies, roses, and custom botanical arrangements.",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=800",
    order: 1,
    isActive: true,
    _count: { products: 3 },
  },
  {
    id: "cat-3",
    name: "Amigurumi Plushies",
    slug: "amigurumi",
    description: "Adorable hand-crocheted animals, whimsical creatures, and nursery plush friends.",
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=800",
    order: 2,
    isActive: true,
    _count: { products: 3 },
  },
  {
    id: "cat-4",
    name: "Home & Table Decor",
    slug: "home-decor",
    description: "Cozy mug rugs, floral coasters, plant hanger hammocks, and heirloom blankets.",
    image: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?q=80&w=800",
    order: 3,
    isActive: true,
    _count: { products: 2 },
  },
];

export async function getCategories(params?: { isActive?: boolean; withCount?: boolean }) {
  try {
    const { isActive, withCount = false } = params || {};

    const where: Record<string, unknown> = {};
    if (isActive !== undefined) where.isActive = isActive;

    const data = await prisma.category.findMany({
      where,
      include: withCount
        ? { _count: { select: { products: { where: { isPublished: true } } } } }
        : undefined,
      orderBy: { order: "asc" },
    });

    return data.length > 0 ? data : defaultCategories;
  } catch {
    return defaultCategories as any;
  }
}

export async function getCategory(slug: string) {
  try {
    const cat = await prisma.category.findUnique({
      where: { slug },
      include: {
        _count: { select: { products: { where: { isPublished: true } } } },
      },
    });
    if (cat) return cat;
    return defaultCategories.find((c) => c.slug === slug) || null;
  } catch {
    return (defaultCategories.find((c) => c.slug === slug) as any) || null;
  }
}

export async function getCategoryById(id: string) {
  return prisma.category.findUnique({ where: { id } });
}

export async function createCategory(data: CategoryInput) {
  const validated = categorySchema.parse(data);

  const category = await prisma.category.create({
    data: {
      name: validated.name,
      slug: validated.slug,
      description: validated.description,
      image: validated.image,
      order: validated.order,
      isActive: validated.isActive,
      metaTitle: validated.metaTitle,
      metaDescription: validated.metaDescription,
    },
  });

  revalidatePath("/admin/categories");
  revalidateStorefront();
  revalidatePath("/shop");
  revalidatePath("/");

  return category;
}

export async function updateCategory(id: string, data: CategoryInput) {
  const validated = categorySchema.parse(data);

  const category = await prisma.category.update({
    where: { id },
    data: {
      name: validated.name,
      slug: validated.slug,
      description: validated.description,
      image: validated.image,
      order: validated.order,
      isActive: validated.isActive,
      metaTitle: validated.metaTitle,
      metaDescription: validated.metaDescription,
    },
  });

  revalidatePath("/admin/categories");
  revalidateStorefront();
  revalidatePath("/shop");
  revalidatePath(`/category/${category.slug}`);
  revalidatePath("/");

  return category;
}

export async function deleteCategory(id: string) {
  // Unassign products first
  await prisma.product.updateMany({
    where: { categoryId: id },
    data: { categoryId: null },
  });

  await prisma.category.delete({ where: { id } });

  revalidatePath("/admin/categories");
  revalidateStorefront();
  revalidatePath("/shop");
  revalidatePath("/");
}

export async function reorderCategories(orderedIds: string[]) {
  await Promise.all(
    orderedIds.map((id, order) =>
      prisma.category.update({ where: { id }, data: { order } })
    )
  );
  revalidatePath("/admin/categories");
  revalidateStorefront();
  revalidatePath("/");
}
