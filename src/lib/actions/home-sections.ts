"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface HomeSectionConfig {
  id: string;
  key: string;
  name: string;
  active: boolean;
  order: number;
}

const DEFAULT_SECTIONS = [
  { key: "hero", name: "Hero Visual & Call-to-Action", order: 0 },
  { key: "values", name: "Value Proposition & Trust Points", order: 1 },
  { key: "categories", name: "Featured Categories Showcase", order: 2 },
  { key: "products", name: "Featured Creations Product Grid", order: 3 },
  { key: "testimonials", name: "Customer Testimonials", order: 4 },
  { key: "newsletter", name: "Newsletter & Discount Form", order: 5 },
];

/**
 * Returns homepage sections, creating the defaults on first run so the
 * storefront always has a complete layout config.
 */
export async function getHomeSections(): Promise<HomeSectionConfig[]> {
  try {
    let sections = await prisma.homeSection.findMany({ orderBy: { order: "asc" } });

    if (sections.length === 0) {
      await prisma.homeSection.createMany({ data: DEFAULT_SECTIONS });
      sections = await prisma.homeSection.findMany({ orderBy: { order: "asc" } });
    }

    return sections;
  } catch {
    return [];
  }
}

export async function saveHomeSections(
  updates: Array<{ id: string; active: boolean; order: number }>
) {
  await prisma.$transaction(
    updates.map((u) =>
      prisma.homeSection.update({
        where: { id: u.id },
        data: { active: u.active, order: u.order },
      })
    )
  );

  revalidatePath("/");
  revalidatePath("/admin/pages");
}
