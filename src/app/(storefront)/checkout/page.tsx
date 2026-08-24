"use client";

import { useState } from "react";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";
import { createOrder } from "@/lib/actions/orders";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Loader2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import styles from "./checkout.module.css";

export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart, coupon, discount, freeShippingApplied } = useCart();

  const [loading, setLoading] = useState(false);
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal" | "cod">("card");

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Pakistan",
    customerNote: "",
    cardNumber: "•••• •••• •••• 4242",
    cardExpiry: "12/28",
    cardCvc: "•••",
  });

  const freeShippingThreshold = 50;
  const shippingCost =
    shippingMethod === "express"
      ? 12.99
      : freeShippingApplied || subtotal >= freeShippingThreshold
      ? 0
      : 5.99;
  const total = Math.max(0, Math.round((subtotal - discount) * 100) / 100) + shippingCost;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!formData.customerName || !formData.customerEmail || !formData.street || !formData.city || !formData.postalCode) {
      toast.error("Please fill in all required shipping fields");
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone || undefined,
        shippingAddress: {
          name: formData.customerName,
          street: formData.street,
          city: formData.city,
          state: formData.state || undefined,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        shippingMethod: shippingMethod === "express" ? "Express Courier (1-2 Days)" : "Standard Artisanal Delivery",
        paymentMethod: paymentMethod.toUpperCase(),
        couponCode: coupon?.code || undefined,
        customerNote: formData.customerNote || undefined,
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId || undefined,
          quantity: i.quantity,
        })),
      };

      const order = await createOrder(orderPayload);
      clearCart();
      toast.success("Order placed successfully! 🎉");
      router.push(`/checkout/confirmation?orderNumber=${order.orderNumber}`);
    } catch (err: any) {
      console.error(err);
      toast.error(
        err?.message?.replace(/^Error:\s*/, "") ||
          "We couldn't place your order. Please check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <h2 className={styles.emptyTitle}>No Items to Checkout</h2>
        <p className={styles.emptyText}>Your shopping cart is currently empty.</p>
        <Link
          href="/shop"
          className={styles.returnBtn}
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Link
          href="/cart"
          className={styles.backLink}
        >
          <ArrowLeft className={styles.backIcon} /> Back to Cart
        </Link>

        <form onSubmit={handlePlaceOrder} className={styles.grid}>
          {/* Left Column: Form Steps */}
          <div className={styles.leftColumn}>
            {/* 1. Customer Contact */}
            <div className={styles.stepBox}>
              <div className={styles.stepHeader}>
                <span className={styles.stepNumber}>
                  1
                </span>
                <h2 className={styles.stepTitle}>
                  Contact Information
                </h2>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.fullWidth}>
                  <label className={styles.inputLabel}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className={styles.inputField}
                  />
                </div>
                <div>
                  <label className={styles.inputLabel}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    required
                    className={styles.inputField}
                  />
                </div>
                <div>
                  <label className={styles.inputLabel}>
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    placeholder="+92 3XX XXXXXXX"
                    className={styles.inputField}
                  />
                </div>
              </div>
            </div>

            {/* 2. Shipping Address */}
            <div className={styles.stepBox}>
              <div className={styles.stepHeader}>
                <span className={styles.stepNumber}>
                  2
                </span>
                <h2 className={styles.stepTitle}>
                  Shipping Address
                </h2>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.fullWidth}>
                  <label className={styles.inputLabel}>
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="123 Handmade Lane, Apt 4"
                    required
                    className={styles.inputField}
                  />
                </div>
                <div>
                  <label className={styles.inputLabel}>
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Lahore"
                    required
                    className={styles.inputField}
                  />
                </div>
                <div>
                  <label className={styles.inputLabel}>
                    State / Province
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="NY"
                    className={styles.inputField}
                  />
                </div>
                <div>
                  <label className={styles.inputLabel}>
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="10001"
                    required
                    className={styles.inputField}
                  />
                </div>
                <div>
                  <label className={styles.inputLabel}>
                    Country *
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={styles.inputField}
                  >
                    <option value="Pakistan">Pakistan</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={styles.inputLabel}>
                  Order & Delivery Notes (Optional)
                </label>
                <textarea
                  name="customerNote"
                  rows={2}
                  value={formData.customerNote}
                  onChange={handleChange}
                  placeholder="Special instructions for the artisan or gift packaging notes..."
                  className={styles.inputField}
                />
              </div>
            </div>

            {/* 3. Delivery Method */}
            <div className={styles.stepBox}>
              <div className={styles.stepHeader}>
                <span className={styles.stepNumber}>
                  3
                </span>
                <h2 className={styles.stepTitle}>
                  Delivery Method
                </h2>
              </div>

              <div className={styles.formGrid}>
                <button
                  type="button"
                  onClick={() => setShippingMethod("standard")}
                  className={`${styles.shippingMethodBtn} ${
                    shippingMethod === "standard" ? styles.shippingMethodBtnActive : ""
                  }`}
                >
                  <div className={styles.shippingMethodInfo}>
                    <p className={styles.shippingMethodTitle}>Standard Delivery</p>
                    <p className={styles.shippingMethodDesc}>3-5 business days</p>
                  </div>
                  <span className={styles.shippingMethodPrice}>
                    {subtotal >= freeShippingThreshold ? "FREE" : "$5.99"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setShippingMethod("express")}
                  className={`${styles.shippingMethodBtn} ${
                    shippingMethod === "express" ? styles.shippingMethodBtnActive : ""
                  }`}
                >
                  <div className={styles.shippingMethodInfo}>
                    <p className={styles.shippingMethodTitle}>Express Craft & Ship</p>
                    <p className={styles.shippingMethodDesc}>1-2 business days expedited</p>
                  </div>
                  <span className={styles.shippingMethodPrice}>$12.99</span>
                </button>
              </div>
            </div>

            {/* 4. Payment */}
            <div className={styles.stepBox}>
              <div className={styles.stepHeaderSpaceBetween}>
                <div className={styles.stepHeaderFlex}>
                  <span className={styles.stepNumber}>
                    4
                  </span>
                  <h2 className={styles.stepTitle}>
                    Payment Method
                  </h2>
                </div>
                <span className={styles.secureText}>
                  <Lock className={styles.secureIcon} /> 256-bit Encrypted
                </span>
              </div>

              <div className={styles.paymentMethodsGrid}>
                {[
                  { id: "card", label: "Credit Card", icon: CreditCard },
                  { id: "paypal", label: "PayPal", icon: ShieldCheck },
                  { id: "cod", label: "Cash Delivery", icon: Truck },
                ].map((method) => (
                  <button
                    type="button"
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id as any)}
                    className={`${styles.paymentMethodBtn} ${
                      paymentMethod === method.id ? styles.paymentMethodBtnActive : ""
                    }`}
                  >
                    <method.icon className={styles.paymentMethodIcon} />
                    <span className={styles.paymentMethodLabel}>{method.label}</span>
                  </button>
                ))}
              </div>

              {paymentMethod === "card" && (
                <div className={styles.cardForm}>
                  <div>
                    <label className={styles.inputLabel}>
                      Card Number
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="4242 •••• •••• 4242"
                      className={styles.inputField}
                    />
                  </div>
                  <div className={styles.formGrid}>
                    <div>
                      <label className={styles.inputLabel}>
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        name="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={handleChange}
                        placeholder="MM/YY"
                        className={styles.inputField}
                      />
                    </div>
                    <div>
                      <label className={styles.inputLabel}>
                        Security CVC
                      </label>
                      <input
                        type="text"
                        name="cardCvc"
                        value={formData.cardCvc}
                        onChange={handleChange}
                        placeholder="123"
                        className={styles.inputField}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary & Place Order */}
          <div className={styles.rightColumn}>
            <div className={styles.summaryBox}>
              <h3 className={styles.summaryTitle}>
                Your Order Summary ({items.length})
              </h3>

              {/* Items preview */}
              <div className={styles.itemsPreview}>
                {items.map((item) => (
                  <div key={item.id} className={styles.itemPreviewRow}>
                    <div className={styles.itemPreviewImageWrapper}>
                      {item.image ? (
                        <img src={item.image} alt={item.name} className={styles.itemPreviewImage} />
                      ) : (
                        <div className={styles.itemPreviewPlaceholder}>🧶</div>
                      )}
                      <span className={styles.itemQtyBadge}>
                        {item.quantity}
                      </span>
                    </div>
                    <div className={styles.itemPreviewInfo}>
                      <p className={styles.itemPreviewName}>{item.name}</p>
                      {item.variantValue && (
                        <p className={styles.itemPreviewVariant}>{item.variantValue}</p>
                      )}
                    </div>
                    <p className={styles.itemPreviewPrice}>
                      {formatPrice((item.salePrice || item.price) * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className={styles.totalsSection}>
                <div className={styles.totalRow}>
                  <span>Subtotal</span>
                  <span className={styles.totalVal}>{formatPrice(subtotal)}</span>
                </div>
                {(discount > 0 || freeShippingApplied) && (
                  <div className={styles.totalRow}>
                    <span>
                      Coupon {coupon?.code}
                      {freeShippingApplied && discount === 0 ? " (Free shipping)" : ""}
                    </span>
                    <span className={styles.totalVal} style={{ color: "#16A34A" }}>
                      -{formatPrice(discount)}
                    </span>
                  </div>
                )}
                <div className={styles.totalRow}>
                  <span>Shipping ({shippingMethod === "express" ? "Express" : "Standard"})</span>
                  <span className={styles.totalVal}>{shippingCost === 0 ? "FREE" : formatPrice(shippingCost)}</span>
                </div>
                <div className={styles.finalTotalRow}>
                  <span>Total Amount</span>
                  <span className={styles.finalTotalVal}>
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="submit"
                disabled={loading}
                className={styles.submitBtn}
              >
                {loading ? (
                  <>
                    <Loader2 className={styles.spinner} />
                    Processing Order...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className={styles.submitIcon} />
                    Place Handmade Order
                  </>
                )}
              </button>

              <div className={styles.trustNotes}>
                <p>🔒 By clicking Place Order, your transaction is securely processed.</p>
                <p>✨ Each piece is crocheted specifically for you with love and care.</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
