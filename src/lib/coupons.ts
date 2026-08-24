export type CouponType = "PERCENTAGE" | "FIXED" | "FREE_SHIPPING";

export interface CouponLike {
  id: string;
  code: string;
  type: CouponType | string;
  value: number;
  minOrder?: number | null;
  maxUses?: number | null;
  usedCount?: number;
  isActive?: boolean;
  startsAt?: Date | string | null;
  expiresAt?: Date | string | null;
  productIds?: string[];
  categoryIds?: string[];
}

export interface CouponItemRef {
  productId: string;
  categoryId?: string | null;
}

export interface CouponEvaluation {
  valid: boolean;
  message?: string;
  discount: number;
  freeShipping: boolean;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Single source of truth for coupon rules. Used by the cart "apply coupon"
 * action and again inside createOrder so a discount shown to the customer
 * can always be honored at checkout.
 */
export function evaluateCoupon(
  coupon: CouponLike,
  subtotal: number,
  items?: CouponItemRef[]
): CouponEvaluation {
  const now = new Date();

  if (coupon.isActive === false) {
    return { valid: false, message: "This coupon is inactive", discount: 0, freeShipping: false };
  }
  if (coupon.startsAt && new Date(coupon.startsAt) > now) {
    return { valid: false, message: "This coupon is not active yet", discount: 0, freeShipping: false };
  }
  if (coupon.expiresAt && new Date(coupon.expiresAt) < now) {
    return { valid: false, message: "This coupon has expired", discount: 0, freeShipping: false };
  }
  if (typeof coupon.maxUses === "number" && typeof coupon.usedCount === "number" && coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
    return { valid: false, message: "This coupon has reached its usage limit", discount: 0, freeShipping: false };
  }

  const productScope = coupon.productIds ?? [];
  if (productScope.length > 0 && items && !items.some((i) => productScope.includes(i.productId))) {
    return { valid: false, message: "This coupon does not apply to the items in your cart", discount: 0, freeShipping: false };
  }

  const categoryScope = coupon.categoryIds ?? [];
  if (categoryScope.length > 0 && items && !items.some((i) => i.categoryId && categoryScope.includes(i.categoryId))) {
    return { valid: false, message: "This coupon does not apply to the categories in your cart", discount: 0, freeShipping: false };
  }

  let discount = 0;
  if (coupon.type === "PERCENTAGE") {
    discount = round2((subtotal * coupon.value) / 100);
  } else if (coupon.type === "FIXED") {
    discount = round2(Math.min(coupon.value, subtotal));
  }

  const freeShipping = coupon.type === "FREE_SHIPPING";
  if (!freeShipping && discount <= 0) {
    return { valid: false, message: "This coupon does not provide a discount on this order", discount: 0, freeShipping: false };
  }

  return { valid: true, discount, freeShipping };
}
