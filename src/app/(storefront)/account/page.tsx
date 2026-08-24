"use client";

import { useState } from "react";
import { User, Package, MapPin, KeyRound, LogOut, Clock, CheckCircle2, Truck, ExternalLink } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import { ORDER_STATUSES } from "@/lib/constants";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import styles from "./account.module.css";

export const dynamic = "force-dynamic";

export default function CustomerAccountPage() {
  const [activeTab, setActiveTab] = useState<"orders" | "profile" | "addresses" | "security">("orders");
  const { data: session } = useSession();

  // Sample customer state
  const [profile, setProfile] = useState({
    name: "Ahmad Jannah",
    email: "customer@crochetstore.com",
    phone: "+1 (555) 234-5678",
  });

  const [orders, setOrders] = useState([
    {
      id: "ord_1",
      orderNumber: "HSY-M9X2-K4P8",
      date: new Date(Date.now() - 86400000 * 2),
      status: "HANDMADE_IN_PRODUCTION",
      total: 78.50,
      items: [
        {
          name: "Handmade Daisy Tote Bag",
          variant: "Color: Cream & Honey",
          quantity: 1,
          price: 54.00,
          image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=400",
        },
        {
          name: "Mini Crocheted Tulip Keychain",
          variant: "Color: Soft Pink",
          quantity: 2,
          price: 12.25,
          image: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?q=80&w=400",
        },
      ],
      trackingNumber: "TRK94829103US",
      trackingUrl: "https://tools.usps.com",
    },
    {
      id: "ord_2",
      orderNumber: "HSY-L3V1-Q9A2",
      date: new Date(Date.now() - 86400000 * 18),
      status: "DELIVERED",
      total: 46.00,
      items: [
        {
          name: "Sleepy Kitten Amigurumi Plushie",
          variant: "Size: Standard 8-inch",
          quantity: 1,
          price: 46.00,
          image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=400",
        },
      ],
      trackingNumber: "DELIVERED-839201",
      trackingUrl: "https://tools.usps.com",
    },
  ]);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile details updated successfully!");
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <div>
            <span className={styles.badge}>
              Customer Portal
            </span>
            <h1 className={styles.title}>
              Welcome Back, {profile.name.split(" ")[0]}
            </h1>
          </div>
        </div>

        <div className={styles.grid}>
          {/* Navigation Sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.sidebarBox}>
              {[
                { key: "orders", label: "My Orders", icon: Package },
                { key: "profile", label: "Profile Info", icon: User },
                { key: "addresses", label: "Saved Addresses", icon: MapPin },
                { key: "security", label: "Password & Security", icon: KeyRound },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`${styles.navBtn} ${activeTab === tab.key ? styles.active : ""}`}
                >
                  <tab.icon className={styles.navIcon} />
                  <span>{tab.label}</span>
                </button>
              ))}

              <div className={styles.signOutWrapper}>
                <Link
                  href="/login"
                  className={styles.signOutBtn}
                >
                  <LogOut className={styles.navIcon} />
                  <span>Sign Out</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Main Panel Content */}
          <div className={styles.mainContent}>
            {/* ORDERS TAB */}
            {activeTab === "orders" && (
              <div className={styles.tabSection}>
                <h2 className={styles.sectionTitle}>
                  Order History & Handmade Status
                </h2>

                <div className={styles.tabSection}>
                  {orders.map((order) => {
                    const statusConfig =
                      ORDER_STATUSES[order.status as keyof typeof ORDER_STATUSES] || {
                        label: order.status,
                        color: "bg-gray-100 text-gray-800",
                      };

                    return (
                      <div
                        key={order.id}
                        className={styles.orderCard}
                      >
                        <div className={styles.orderHeader}>
                          <div className={styles.orderMetaBlock}>
                            <p className={styles.orderMetaLabel}>Order ID</p>
                            <p className={`${styles.orderMetaValue} ${styles.orderMetaId}`}>
                              {order.orderNumber}
                            </p>
                          </div>
                          <div className={styles.orderMetaBlock}>
                            <p className={styles.orderMetaLabel}>Placed On</p>
                            <p className={styles.orderMetaValue}>
                              {formatDate(order.date)}
                            </p>
                          </div>
                          <div className={styles.orderMetaBlock}>
                            <p className={styles.orderMetaLabel}>Total</p>
                            <p className={`${styles.orderMetaValue} ${styles.orderMetaPrice}`}>
                              {formatPrice(order.total)}
                            </p>
                          </div>
                          <div>
                            <span
                              className={`${styles.statusBadge} ${statusConfig.color}`}
                            >
                              {statusConfig.label}
                            </span>
                          </div>
                        </div>

                        {/* Items in order */}
                        <div className={styles.orderItems}>
                          {order.items.map((item, idx) => (
                            <div key={idx} className={styles.orderItem}>
                              <div className={styles.itemImageWrapper}>
                                <img src={item.image} alt={item.name} className={styles.itemImage} />
                              </div>
                              <div className={styles.itemInfo}>
                                <p className={styles.itemName}>{item.name}</p>
                                <p className={styles.itemVariant}>{item.variant}</p>
                              </div>
                              <div className={styles.itemPriceBlock}>
                                <p className={styles.itemPrice}>{formatPrice(item.price * item.quantity)}</p>
                                <p className={styles.itemQty}>Qty: {item.quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Tracking Link */}
                        {order.trackingNumber && (
                          <div className={styles.trackingBlock}>
                            <span className={styles.trackingInfo}>
                              <Truck className={styles.trackingIcon} />
                              Tracking: <span className={styles.trackingId}>{order.trackingNumber}</span>
                            </span>
                            <a
                              href={order.trackingUrl}
                              target="_blank"
                              rel="noreferrer"
                              className={styles.trackingLink}
                            >
                              Track Shipment <ExternalLink className={styles.externalIcon} />
                            </a>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <div className={styles.cardBox}>
                <h2 className={styles.sectionTitle}>
                  Personal Information
                </h2>
                <form onSubmit={handleProfileSave} className={styles.form}>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                      className={styles.inputField}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                      className={styles.inputField}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile((prev) => ({ ...prev, phone: e.target.value }))}
                      className={styles.inputField}
                    />
                  </div>
                  <button
                    type="submit"
                    className={styles.submitBtn}
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            )}

            {/* ADDRESSES TAB */}
            {activeTab === "addresses" && (
              <div className={styles.cardBox}>
                <h2 className={styles.sectionTitle}>
                  Saved Delivery Addresses
                </h2>
                <div className={styles.addressBox}>
                  <div className={styles.addressHeader}>
                    <span className={styles.addressBadge}>
                      Default Delivery
                    </span>
                  </div>
                  <p className={styles.addressName}>Ahmad Jannah</p>
                  <p className={styles.addressText}>128 Magnolia Terrace, Apt 3B</p>
                  <p className={styles.addressText}>Gulberg III, Lahore, Punjab, Pakistan</p>
                  <p className={styles.addressText}>Phone: +1 (555) 234-5678</p>
                </div>
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === "security" && (
              <div className={styles.cardBox}>
                <h2 className={styles.sectionTitle}>
                  Password & Security
                </h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    toast.success("Password updated successfully!");
                  }}
                  className={styles.form}
                >
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      Current Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      required
                      className={styles.inputField}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      required
                      className={styles.inputField}
                    />
                  </div>
                  <button
                    type="submit"
                    className={styles.submitBtn}
                  >
                    Update Password
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
