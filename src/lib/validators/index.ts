import { z } from "zod";

// ─── AUTH ────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// ─── PRODUCTS ────────────────────────────────────────────────────────────

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be positive"),
  salePrice: z.coerce.number().min(0).optional().nullable(),
  sku: z.string().optional().nullable(),
  stock: z.coerce.number().int().min(0).default(0),
  materials: z.string().optional().nullable(),
  dimensions: z.string().optional().nullable(),
  careInstructions: z.string().optional().nullable(),
  shippingInfo: z.string().optional().nullable(),
  weight: z.coerce.number().min(0).optional().nullable(),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  isBestseller: z.boolean().default(false),
  isNew: z.boolean().default(false),
  categoryId: z.string().optional().nullable(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  metaKeywords: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
});

export const productVariantSchema = z.object({
  name: z.string().min(1, "Variant name is required"),
  value: z.string().min(1, "Variant value is required"),
  price: z.coerce.number().min(0).optional().nullable(),
  stock: z.coerce.number().int().min(0).default(0),
  sku: z.string().optional().nullable(),
});

// ─── CATEGORIES ──────────────────────────────────────────────────────────

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  order: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
});

// ─── COLLECTIONS ─────────────────────────────────────────────────────────

export const collectionSchema = z.object({
  name: z.string().min(1, "Collection name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
});

// ─── ORDERS ──────────────────────────────────────────────────────────────

export const orderStatusSchema = z.enum([
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "HANDMADE_IN_PRODUCTION",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
]);

export const checkoutSchema = z.object({
  customerName: z.string().min(1, "Name is required"),
  customerEmail: z.string().email("Invalid email"),
  customerPhone: z.string().optional(),
  shippingAddress: z.object({
    name: z.string().min(1, "Name is required"),
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().optional(),
    postalCode: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required"),
  }),
  billingAddress: z.object({
    name: z.string().min(1),
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().optional(),
    postalCode: z.string().min(1),
    country: z.string().min(1),
  }).optional().nullable(),
  shippingMethod: z.string().optional(),
  paymentMethod: z.string().optional(),
  couponCode: z.string().optional(),
  customerNote: z.string().optional(),
});

// ─── REVIEWS ─────────────────────────────────────────────────────────────

export const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().optional(),
  productId: z.string().min(1),
});

// ─── COUPONS ─────────────────────────────────────────────────────────────

export const couponSchema = z.object({
  code: z.string().min(1, "Coupon code is required").toUpperCase(),
  type: z.enum(["PERCENTAGE", "FIXED", "FREE_SHIPPING"]),
  value: z.coerce.number().min(0),
  minOrder: z.coerce.number().min(0).optional().nullable(),
  maxUses: z.coerce.number().int().min(0).optional().nullable(),
  isActive: z.boolean().default(true),
  productIds: z.array(z.string()).optional(),
  categoryIds: z.array(z.string()).optional(),
  startsAt: z.string().optional().nullable(),
  expiresAt: z.string().optional().nullable(),
});

// ─── CUSTOM ORDERS ───────────────────────────────────────────────────────

export const customOrderSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  productType: z.string().min(1, "Product type is required"),
  colors: z.string().optional(),
  size: z.string().optional(),
  customText: z.string().optional(),
  description: z.string().optional(),
  budget: z.string().optional(),
  deadline: z.string().optional(),
});

// ─── CONTACT ─────────────────────────────────────────────────────────────

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(1, "Message is required"),
});

// ─── NEWSLETTER ──────────────────────────────────────────────────────────

export const newsletterSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// ─── BLOG ────────────────────────────────────────────────────────────────

export const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(1, "Content is required"),
  featuredImage: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED", "ARCHIVED"]).default("DRAFT"),
  publishedAt: z.string().optional().nullable(),
  scheduledAt: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  authorName: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  metaKeywords: z.string().optional().nullable(),
});

// ─── SITE SETTINGS ───────────────────────────────────────────────────────

export const siteSettingsSchema = z.object({
  siteName: z.string().min(1),
  tagline: z.string().optional().nullable(),
  logo: z.string().optional().nullable(),
  favicon: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  instagram: z.string().optional().nullable(),
  facebook: z.string().optional().nullable(),
  twitter: z.string().optional().nullable(),
  pinterest: z.string().optional().nullable(),
  tiktok: z.string().optional().nullable(),
  youtube: z.string().optional().nullable(),
  defaultMetaTitle: z.string().optional().nullable(),
  defaultMetaDescription: z.string().optional().nullable(),
  currency: z.string().default("PKR"),
  currencySymbol: z.string().default("Rs"),
  freeShippingThreshold: z.coerce.number().optional().nullable(),
  announcementText: z.string().optional().nullable(),
  announcementBg: z.string().optional().nullable(),
  announcementTextColor: z.string().optional().nullable(),
  announcementActive: z.boolean().default(false),
});

// ─── THEME SETTINGS ──────────────────────────────────────────────────────

export const themeSettingsSchema = z.object({
  primaryColor: z.string(),
  secondaryColor: z.string(),
  accentColor: z.string(),
  backgroundColor: z.string(),
  textColor: z.string(),
  mutedColor: z.string(),
  headingFont: z.string(),
  bodyFont: z.string(),
  borderRadius: z.string(),
  buttonStyle: z.string(),
  cardStyle: z.string(),
  shadowStyle: z.string(),
});

// ─── TYPE EXPORTS ────────────────────────────────────────────────────────

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type CollectionInput = z.infer<typeof collectionSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type CouponInput = z.infer<typeof couponSchema>;
export type CustomOrderInput = z.infer<typeof customOrderSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type BlogPostInput = z.infer<typeof blogPostSchema>;
export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
export type ThemeSettingsInput = z.infer<typeof themeSettingsSchema>;
