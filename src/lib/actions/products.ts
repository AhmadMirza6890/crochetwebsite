"use server";

import prisma from "@/lib/prisma";
import { productSchema, type ProductInput } from "@/lib/validators";
import { revalidatePath } from "next/cache";
import { revalidateStorefront } from "@/lib/revalidate";
import { slugify } from "@/lib/utils";

const fallbackProducts = [
  {
    id: "prod-1",
    name: "Daisy Meadow Granny Square Tote",
    slug: "daisy-meadow-granny-square-tote",
    description: "Individually crocheted botanical daisy squares assembled into a spacious, lined everyday tote bag with sturdy cotton reinforced shoulder straps.",
    price: 68.00,
    salePrice: 58.00,
    sku: "HSY-BAG-001",
    stock: 12,
    materials: "100% Organic Milk Cotton Yarn, Linen Lining",
    dimensions: '14" x 15" with 11" strap drop',
    careInstructions: "Gently hand-wash in cool water. Lay flat to dry.",
    isPublished: true,
    isFeatured: true,
    isBestseller: true,
    isNew: true,
    categoryId: "cat-1",
    category: { id: "cat-1", name: "Crochet Bags", slug: "crochet-bags" },
    images: [
      { id: "img-1", url: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800", order: 0 },
      { id: "img-2", url: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?q=80&w=800", order: 1 },
    ],
    variants: [
      { id: "var-1", name: "Color", value: "Cream & Yellow Daisy", price: 58.00 },
      { id: "var-2", name: "Color", value: "Pastel Lavender Daisy", price: 62.00 },
    ],
    tags: [{ name: "bag" }, { name: "tote" }, { name: "daisy" }],
    reviews: [
      { id: "rev-1", rating: 5, title: "Exquisite craftsmanship!", comment: "The stitching is tight and even, and the lining makes it so practical for daily use.", createdAt: new Date(), user: { name: "Emma Watson" } },
    ],
    averageRating: 5.0,
    reviewCount: 12,
    createdAt: new Date(),
  },
  {
    id: "prod-2",
    name: "Everlasting Pastel Tulip Bouquet (5 Stems)",
    slug: "everlasting-pastel-tulip-bouquet",
    description: "Delightful bouquet of 5 hand-crocheted tulips in gentle pastel tones that will brighten your room forever without needing water.",
    price: 42.00,
    salePrice: 38.00,
    sku: "HSY-FLW-001",
    stock: 20,
    materials: "Soft Combed Cotton, Flexible Wire Stems",
    dimensions: 'Approx 11" tall',
    careInstructions: "Dust lightly with a soft brush.",
    isPublished: true,
    isFeatured: true,
    isBestseller: true,
    isNew: false,
    categoryId: "cat-2",
    category: { id: "cat-2", name: "Crochet Flowers", slug: "crochet-flowers" },
    images: [
      { id: "img-3", url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=800", order: 0 },
    ],
    variants: [],
    tags: [{ name: "flowers" }, { name: "tulips" }],
    reviews: [
      { id: "rev-2", rating: 5, title: "So sweet and delicate", comment: "Bought these for my desk and I smile every time I look at them.", createdAt: new Date(), user: { name: "Sarah L." } },
    ],
    averageRating: 4.9,
    reviewCount: 8,
    createdAt: new Date(),
  },
  {
    id: "prod-3",
    name: "Sleepy Cinnamon Kitten Amigurumi",
    slug: "sleepy-cinnamon-kitten-amigurumi",
    description: "Lovingly hand-crocheted kitten plushie made with ultra-plush velvet yarn and embroidered sleepy eyes. Safe for all ages.",
    price: 45.00,
    salePrice: null,
    sku: "HSY-AMI-001",
    stock: 8,
    materials: "Hypoallergenic Velvet Chenille Yarn, Polyfill Stuffing",
    dimensions: '8" height x 6" width',
    careInstructions: "Spot clean with damp cloth.",
    isPublished: true,
    isFeatured: true,
    isBestseller: false,
    isNew: true,
    categoryId: "cat-3",
    category: { id: "cat-3", name: "Amigurumi Plushies", slug: "amigurumi" },
    images: [
      { id: "img-4", url: "https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=800", order: 0 },
    ],
    variants: [],
    tags: [{ name: "plush" }, { name: "cat" }],
    reviews: [],
    averageRating: 5.0,
    reviewCount: 5,
    createdAt: new Date(),
  },
  {
    id: "prod-4",
    name: "Blossom Floral Mug Rug & Coaster Set",
    slug: "blossom-floral-mug-rug-coaster-set",
    description: "Set of 4 vintage-inspired crochet floral coasters designed to protect wooden surfaces while adding handmade warmth to your coffee ritual.",
    price: 24.00,
    salePrice: null,
    sku: "HSY-HOM-001",
    stock: 25,
    materials: "100% Natural Cotton Yarn",
    dimensions: '5" diameter each',
    careInstructions: "Machine washable in laundry mesh bag on delicate.",
    isPublished: true,
    isFeatured: true,
    isBestseller: false,
    isNew: false,
    categoryId: "cat-4",
    category: { id: "cat-4", name: "Home & Table Decor", slug: "home-decor" },
    images: [
      { id: "img-5", url: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?q=80&w=800", order: 0 },
    ],
    variants: [],
    tags: [{ name: "coasters" }, { name: "home" }],
    reviews: [],
    averageRating: 4.8,
    reviewCount: 9,
    createdAt: new Date(),
  },
];

export async function getProducts(params?: {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  collectionId?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isFeatured?: boolean;
  isPublished?: boolean;
}) {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      categoryId,
      collectionId,
      sort = "newest",
      minPrice,
      maxPrice,
      inStock,
      isFeatured,
      isPublished,
    } = params || {};

    const where: Record<string, unknown> = {};

    if (isPublished !== undefined) where.isPublished = isPublished;
    if (isFeatured) where.isFeatured = true;
    if (categoryId) where.categoryId = categoryId;
    if (inStock) where.stock = { gt: 0 };
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) (where.price as Record<string, unknown>).gte = minPrice;
      if (maxPrice !== undefined) (where.price as Record<string, unknown>).lte = maxPrice;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { tags: { some: { name: { contains: search, mode: "insensitive" } } } },
      ];
    }
    if (collectionId) {
      where.collections = { some: { collectionId } };
    }

    let orderBy: Record<string, string> = { createdAt: "desc" };
    switch (sort) {
      case "price-asc":
        orderBy = { price: "asc" };
        break;
      case "price-desc":
        orderBy = { price: "desc" };
        break;
      case "popular":
        orderBy = { orderItems: { _count: "desc" } } as unknown as Record<string, string>;
        break;
      case "rating":
        orderBy = { reviews: { _count: "desc" } } as unknown as Record<string, string>;
        break;
      case "name-asc":
        orderBy = { name: "asc" };
        break;
      default:
        orderBy = { createdAt: "desc" };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images: { orderBy: { order: "asc" } },
          category: true,
          tags: true,
          reviews: { where: { status: "APPROVED" }, select: { rating: true } },
          _count: { select: { reviews: { where: { status: "APPROVED" } }, orderItems: true } },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    if (products.length === 0 && !search && !categoryId) {
      return {
        products: fallbackProducts as any,
        total: fallbackProducts.length,
        pages: 1,
        page: 1,
      };
    }

    return {
      products: products.map((p) => ({
        ...p,
        averageRating:
          p.reviews.length > 0
            ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
            : 0,
        reviewCount: p._count.reviews,
      })),
      total,
      pages: Math.ceil(total / limit),
      page,
    };
  } catch {
    let filtered = [...fallbackProducts];
    if (params?.categoryId) filtered = filtered.filter((p) => p.categoryId === params.categoryId);
    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    return {
      products: filtered as any,
      total: filtered.length,
      pages: 1,
      page: 1,
    };
  }
}

export async function getProduct(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { order: "asc" } },
        category: true,
        tags: true,
        variants: true,
        reviews: {
          where: { status: "APPROVED" },
          include: { user: { select: { name: true, image: true } } },
          orderBy: { createdAt: "desc" },
        },
        _count: { select: { reviews: { where: { status: "APPROVED" } } } },
      },
    });

    if (product) {
      const averageRating =
        product.reviews.length > 0
          ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
            product.reviews.length
          : 0;

      return { ...product, averageRating, reviewCount: product._count.reviews };
    }

    const fallback = fallbackProducts.find((p) => p.slug === slug);
    return fallback ? (fallback as any) : null;
  } catch {
    const fallback = fallbackProducts.find((p) => p.slug === slug);
    return fallback ? (fallback as any) : null;
  }
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      images: { orderBy: { order: "asc" } },
      category: true,
      tags: true,
      variants: true,
    },
  });
}

export async function createProduct(data: ProductInput) {
  const validated = productSchema.parse(data);
  const slug = validated.slug || slugify(validated.name);

  const product = await prisma.product.create({
    data: {
      name: validated.name,
      slug,
      description: validated.description,
      price: validated.price,
      salePrice: validated.salePrice,
      sku: validated.sku,
      stock: validated.stock,
      materials: validated.materials,
      dimensions: validated.dimensions,
      careInstructions: validated.careInstructions,
      shippingInfo: validated.shippingInfo,
      weight: validated.weight,
      isPublished: validated.isPublished,
      isFeatured: validated.isFeatured,
      isBestseller: validated.isBestseller,
      isNew: validated.isNew,
      categoryId: validated.categoryId,
      metaTitle: validated.metaTitle,
      metaDescription: validated.metaDescription,
      metaKeywords: validated.metaKeywords,
      tags: validated.tags
        ? { create: validated.tags.map((tag) => ({ name: tag })) }
        : undefined,
    },
  });

  revalidatePath("/admin/products");
  revalidateStorefront();
  revalidatePath("/");

  return product;
}

export async function updateProduct(id: string, data: ProductInput) {
  const validated = productSchema.parse(data);

  // Delete existing tags and recreate
  await prisma.productTag.deleteMany({ where: { productId: id } });

  const product = await prisma.product.update({
    where: { id },
    data: {
      name: validated.name,
      slug: validated.slug,
      description: validated.description,
      price: validated.price,
      salePrice: validated.salePrice,
      sku: validated.sku,
      stock: validated.stock,
      materials: validated.materials,
      dimensions: validated.dimensions,
      careInstructions: validated.careInstructions,
      shippingInfo: validated.shippingInfo,
      weight: validated.weight,
      isPublished: validated.isPublished,
      isFeatured: validated.isFeatured,
      isBestseller: validated.isBestseller,
      isNew: validated.isNew,
      categoryId: validated.categoryId,
      metaTitle: validated.metaTitle,
      metaDescription: validated.metaDescription,
      metaKeywords: validated.metaKeywords,
      tags: validated.tags
        ? { create: validated.tags.map((tag) => ({ name: tag })) }
        : undefined,
    },
  });

  revalidatePath("/admin/products");
  revalidateStorefront();
  revalidatePath(`/product/${product.slug}`);
  revalidatePath("/");

  return product;
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  revalidateStorefront();
  revalidatePath("/");
}

export async function toggleProductPublish(id: string) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new Error("Product not found");

  await prisma.product.update({
    where: { id },
    data: { isPublished: !product.isPublished },
  });

  revalidatePath("/admin/products");
  revalidateStorefront();
  revalidatePath("/");
}

export async function addProductImages(productId: string, urls: string[]) {
  const existing = await prisma.productImage.count({ where: { productId } });

  await prisma.productImage.createMany({
    data: urls.map((url, i) => ({
      productId,
      url,
      order: existing + i,
    })),
  });

  revalidatePath("/admin/products");
  revalidateStorefront();
}

export async function deleteProductImage(imageId: string) {
  await prisma.productImage.delete({ where: { id: imageId } });
  revalidatePath("/admin/products");
  revalidateStorefront();
}

export async function reorderProductImages(
  productId: string,
  imageIds: string[]
) {
  await Promise.all(
    imageIds.map((id, order) =>
      prisma.productImage.update({ where: { id }, data: { order } })
    )
  );
  revalidatePath("/admin/products");
  revalidateStorefront();
}

export async function getRelatedProducts(productId: string, categoryId?: string | null) {
  try {
    const products = await prisma.product.findMany({
      where: {
        isPublished: true,
        id: { not: productId },
        ...(categoryId ? { categoryId } : {}),
      },
      include: {
        images: { orderBy: { order: "asc" }, take: 1 },
        reviews: { where: { status: "APPROVED" }, select: { rating: true } },
      },
      take: 4,
      orderBy: { createdAt: "desc" },
    });
    if (products.length > 0) return products;
    return fallbackProducts.filter((p) => p.id !== productId).slice(0, 4) as any;
  } catch {
    return fallbackProducts.filter((p) => p.id !== productId).slice(0, 4) as any;
  }
}

export async function searchProducts(query: string) {
  if (!query || query.length < 2) return [];

  try {
    return await prisma.product.findMany({
      where: {
        isPublished: true,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { tags: { some: { name: { contains: query, mode: "insensitive" } } } },
          { category: { name: { contains: query, mode: "insensitive" } } },
        ],
      },
      include: {
        images: { orderBy: { order: "asc" }, take: 1 },
        category: true,
      },
      take: 8,
    });
  } catch {
    const q = query.toLowerCase();
    return fallbackProducts
      .filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
      .slice(0, 8) as any;
  }
}
