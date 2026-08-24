export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Hearthside Yarn";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const ORDER_STATUSES = {
  PENDING: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  CONFIRMED: { label: "Confirmed", color: "bg-blue-100 text-blue-800" },
  PROCESSING: { label: "Processing", color: "bg-indigo-100 text-indigo-800" },
  HANDMADE_IN_PRODUCTION: { label: "In Production", color: "bg-purple-100 text-purple-800" },
  SHIPPED: { label: "Shipped", color: "bg-cyan-100 text-cyan-800" },
  DELIVERED: { label: "Delivered", color: "bg-green-100 text-green-800" },
  CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-800" },
  REFUNDED: { label: "Refunded", color: "bg-gray-100 text-gray-800" },
} as const;

export const CUSTOM_ORDER_STATUSES = {
  PENDING: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  ACCEPTED: { label: "Accepted", color: "bg-green-100 text-green-800" },
  REJECTED: { label: "Rejected", color: "bg-red-100 text-red-800" },
  QUOTE_SENT: { label: "Quote Sent", color: "bg-blue-100 text-blue-800" },
  INFO_REQUESTED: { label: "Info Requested", color: "bg-orange-100 text-orange-800" },
  IN_PROGRESS: { label: "In Progress", color: "bg-purple-100 text-purple-800" },
  COMPLETED: { label: "Completed", color: "bg-emerald-100 text-emerald-800" },
  CANCELLED: { label: "Cancelled", color: "bg-gray-100 text-gray-800" },
} as const;

export const REVIEW_STATUSES = {
  PENDING: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  APPROVED: { label: "Approved", color: "bg-green-100 text-green-800" },
  REJECTED: { label: "Rejected", color: "bg-red-100 text-red-800" },
  HIDDEN: { label: "Hidden", color: "bg-gray-100 text-gray-800" },
} as const;

export const PRODUCT_BADGES = [
  { key: "isNew", label: "New", color: "bg-emerald-500" },
  { key: "isBestseller", label: "Bestseller", color: "bg-amber-500" },
  { key: "isFeatured", label: "Featured", color: "bg-violet-500" },
] as const;

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Best Rated" },
] as const;

export const PAGE_SECTION_TYPES = [
  { value: "HERO", label: "Hero Section" },
  { value: "PRODUCT_GRID", label: "Product Grid" },
  { value: "CATEGORY_GRID", label: "Category Grid" },
  { value: "COLLECTION", label: "Collection" },
  { value: "BANNER", label: "Banner" },
  { value: "IMAGE_TEXT", label: "Image + Text" },
  { value: "TESTIMONIALS", label: "Testimonials" },
  { value: "FAQ", label: "FAQ" },
  { value: "NEWSLETTER", label: "Newsletter" },
  { value: "GALLERY", label: "Gallery" },
  { value: "VIDEO", label: "Video" },
  { value: "RICH_TEXT", label: "Rich Text" },
  { value: "INSTAGRAM", label: "Instagram / Social" },
  { value: "CUSTOM_HTML", label: "Custom HTML" },
] as const;

export const FONTS = [
  { value: "Playfair Display", label: "Playfair Display" },
  { value: "Cormorant Garamond", label: "Cormorant Garamond" },
  { value: "Lora", label: "Lora" },
  { value: "Merriweather", label: "Merriweather" },
  { value: "DM Serif Display", label: "DM Serif Display" },
  { value: "Inter", label: "Inter" },
  { value: "Outfit", label: "Outfit" },
  { value: "Poppins", label: "Poppins" },
  { value: "DM Sans", label: "DM Sans" },
  { value: "Nunito Sans", label: "Nunito Sans" },
] as const;

export const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Collections", href: "/shop?view=collections" },
  { label: "Custom Orders", href: "/custom-order" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

export const ADMIN_NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "LayoutDashboard" },
  { label: "Products", href: "/admin/products", icon: "Package" },
  { label: "Categories", href: "/admin/categories", icon: "FolderTree" },
  { label: "Collections", href: "/admin/collections", icon: "Layers" },
  { label: "Orders", href: "/admin/orders", icon: "ShoppingCart" },
  { label: "Customers", href: "/admin/customers", icon: "Users" },
  { label: "Reviews", href: "/admin/reviews", icon: "Star" },
  { label: "Coupons", href: "/admin/coupons", icon: "Ticket" },
  { label: "Custom Orders", href: "/admin/custom-orders", icon: "Paintbrush" },
  { label: "Blog", href: "/admin/blog", icon: "FileText" },
  { label: "Media", href: "/admin/media", icon: "Image" },
  { label: "Pages", href: "/admin/pages", icon: "Layout" },
  { label: "Theme", href: "/admin/theme", icon: "Palette" },
  { label: "Settings", href: "/admin/settings", icon: "Settings" },
  { label: "Analytics", href: "/admin/analytics", icon: "BarChart3" },
] as const;
