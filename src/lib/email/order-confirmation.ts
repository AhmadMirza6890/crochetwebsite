import { APP_NAME, APP_URL } from "@/lib/constants";
import { readFile } from "fs/promises";
import path from "path";
import prisma from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import type { MailAttachment } from "./mailer";

export interface OrderEmailItem {
  productName: string;
  productImage?: string | null;
  variantName?: string | null;
  variantValue?: string | null;
  quantity: number;
  price: number;
  total: number;
}

export interface OrderEmailData {
  orderNumber: string;
  createdAt: Date | string;
  customerName: string;
  customerEmail: string;
  items: OrderEmailItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  couponCode?: string | null;
  shippingMethod?: string | null;
  paymentMethod?: string | null;
  shippingAddress?: {
    name?: string;
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  } | null;
}

const BRAND_PRIMARY = "#8C4A2B";
const BRAND_DARK = "#5C3A21";
const TEXT = "#3E2F23";
const MUTED = "#8A7563";
const CREAM = "#FAF6F0";
const BORDER = "#EADFCE";
const GREEN = "#4C7A4C";

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function money(amount: number): string {
  return formatPrice(amount);
}

function toAbsoluteUrl(url?: string | null, base: string = APP_URL): string | null {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return `${base}${url.startsWith("/") ? "" : "/"}${url}`;
}

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const IMAGE_MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

/**
 * Product images can't just be remote links — Gmail blocks/proxies them and
 * DB-stored uploads may sit behind hosting restrictions. So we embed them as
 * inline CID attachments, which renders reliably in every inbox:
 *  - /api/images/{id} → bytes straight from Postgres
 *  - /uploads/...     → legacy files read from disk
 */
async function resolveItemImage(
  item: OrderEmailItem,
  index: number,
  base: string
): Promise<{ html: string; attachment: MailAttachment | null }> {
  const cid = `itemimg_${index}`;
  const src = item.productImage;

  const imgTag = `<img src="cid:${cid}" alt="${escapeHtml(item.productName)}" width="72" height="72" style="display:block;width:72px;height:72px;object-fit:cover;border-radius:10px;border:1px solid ${BORDER};" />`;

  // New uploads live in Postgres — load the bytes directly.
  const dbMatch = src?.match(/^\/api\/images\/([a-zA-Z0-9]+)$/);
  if (dbMatch) {
    try {
      const media = await prisma.media.findUnique({
        where: { id: dbMatch[1] },
        select: { data: true, mimeType: true },
      });
      if (media?.data) {
        return {
          html: imgTag,
          attachment: {
            filename: `product-${index + 1}.${(media.mimeType || "image/png").split("/")[1] || "png"}`,
            content: Buffer.from(media.data),
            cid,
            contentType: media.mimeType || "image/png",
          },
        };
      }
    } catch {
      // fall through to absolute URL fallback
    }
  }

  if (src && src.startsWith("/uploads/")) {
    try {
      const filePath = path.join(process.cwd(), "public", src);
      const content = await readFile(filePath);
      const ext = path.extname(src).toLowerCase();
      const attachment: MailAttachment = {
        filename: path.basename(src),
        content,
        cid,
        contentType: IMAGE_MIME[ext] || "application/octet-stream",
      };
      return { html: imgTag, attachment };
    } catch {
      // file missing on disk — fall through to absolute URL
    }
  }

  const image = toAbsoluteUrl(src, base);
  return {
    html: image
      ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(item.productName)}" width="72" height="72" style="display:block;width:72px;height:72px;object-fit:cover;border-radius:10px;border:1px solid ${BORDER};" />`
      : `<div style="width:72px;height:72px;line-height:72px;text-align:center;font-size:30px;background:${CREAM};border-radius:10px;border:1px solid ${BORDER};">&#129526;</div>`,
    attachment: null,
  };
}

function itemRow(item: OrderEmailItem, imageHtml: string): string {
  const variantBits = [item.variantName, item.variantValue].filter(Boolean).join(": ");

  return `
  <tr>
    <td style="padding:14px 0;border-bottom:1px solid ${BORDER};">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td width="88" valign="top">${imageHtml}</td>
          <td valign="top" style="font-family:Georgia,'Times New Roman',serif;">
            <p style="margin:0 0 4px;font-size:15px;font-weight:bold;color:${TEXT};">${escapeHtml(item.productName)}</p>
            ${variantBits ? `<p style="margin:0 0 4px;font-size:12px;color:${MUTED};">${escapeHtml(variantBits)}</p>` : ""}
            <p style="margin:0;font-size:13px;color:${MUTED};">Qty: ${item.quantity} &times; ${money(item.price)}</p>
          </td>
          <td valign="top" align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;color:${TEXT};white-space:nowrap;">
            ${money(item.total)}
          </td>
        </tr>
      </table>
    </td>
  </tr>`;
}

export async function buildOrderConfirmationEmail(
  order: OrderEmailData,
  baseUrl: string = APP_URL
): Promise<{
  subject: string;
  html: string;
  text: string;
  attachments: MailAttachment[];
}> {
  const firstName = order.customerName.trim().split(/\s+/)[0] || "there";

  const resolved = await Promise.all(
    order.items.map((item, i) => resolveItemImage(item, i, baseUrl))
  );
  const rows = order.items
    .map((item, i) => itemRow(item, resolved[i].html))
    .join("");
  const attachments = resolved
    .map((r) => r.attachment)
    .filter((a): a is MailAttachment => a !== null);
  const address = order.shippingAddress;
  const addressLines = address
    ? [
        address.name,
        address.street,
        [address.city, address.state, address.postalCode].filter(Boolean).join(", "),
        address.country,
      ]
        .filter(Boolean)
        .map((line) => escapeHtml(line))
        .join("<br />")
    : "—";

  const discountRow =
    order.discount > 0
      ? `<tr>
          <td style="padding:4px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:${MUTED};">Discount${order.couponCode ? ` (${escapeHtml(order.couponCode)})` : ""}</td>
          <td align="right" style="padding:4px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;color:${GREEN};">&minus; ${money(order.discount)}</td>
        </tr>`
      : "";

  const shippingLabel = order.couponCode && order.shippingCost === 0 && order.discount === 0
    ? '<span style="color:#4C7A4C;font-weight:bold;">FREE</span>'
    : order.shippingCost === 0
      ? '<span style="color:#4C7A4C;font-weight:bold;">FREE</span>'
      : money(order.shippingCost);

  const subject = `Thank you for your order, ${firstName}! — ${APP_NAME} #${order.orderNumber}`;

  const text = [
    `Hi ${firstName}, thank you for shopping with ${APP_NAME}!`,
    ``,
    `Order number: ${order.orderNumber}`,
    `Placed on: ${formatDate(order.createdAt)}`,
    ``,
    `Items:`,
    ...order.items.map(
      (i) => `- ${i.productName}${i.variantValue ? ` (${i.variantValue})` : ""} x ${i.quantity} — ${money(i.total)}`
    ),
    ``,
    `Subtotal: ${money(order.subtotal)}`,
    order.discount > 0 ? `Discount${order.couponCode ? ` (${order.couponCode})` : ""}: -${money(order.discount)}` : "",
    `Shipping: ${order.shippingCost === 0 ? "FREE" : money(order.shippingCost)}`,
    `Total: ${money(order.total)}`,
    ``,
    `Ship to:`,
    addressLines.replace(/<br \/>/g, "\n"),
    ``,
    `Each piece is crocheted by hand especially for you. We will email you tracking details as soon as your order ships.`,
    ``,
    `${APP_NAME} — ${baseUrl}`,
  ]
    .filter((line) => line !== "")
    .join("\n");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:#F3EBE1;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Your order ${escapeHtml(order.orderNumber)} is confirmed — we're already picking out the softest yarn for you.</div>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#F3EBE1;padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;width:100%;">

          <!-- Brand header -->
          <tr>
            <td align="center" style="background-color:${BRAND_DARK};border-radius:16px 16px 0 0;padding:28px 24px;">
              <div style="width:56px;height:56px;line-height:56px;margin:0 auto 10px;text-align:center;font-size:28px;background:${BRAND_PRIMARY};border-radius:50%;">&#129526;</div>
              <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:22px;letter-spacing:3px;color:#FFF8EF;text-transform:uppercase;">Hearthside Yarn</p>
              <p style="margin:6px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:1px;color:#E4C9AC;text-transform:uppercase;">Handmade crochet, crafted slowly with love</p>
            </td>
          </tr>

          <!-- Hero -->
          <tr>
            <td style="background-color:#FFFFFF;padding:36px 40px 8px 40px;text-align:center;">
              <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:2px;color:${BRAND_PRIMARY};text-transform:uppercase;">Order Confirmed</p>
              <h1 style="margin:0 0 12px;font-family:Georgia,'Times New Roman',serif;font-size:28px;color:${TEXT};">Thank you, ${escapeHtml(firstName)}!</h1>
              <p style="margin:0 auto;max-width:420px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:22px;color:${MUTED};">
                Your order has been received and is now part of our making queue. Every stitch is done by hand, and we can't wait for you to unwrap it.
              </p>
            </td>
          </tr>

          <!-- Order meta -->
          <tr>
            <td style="background-color:#FFFFFF;padding:20px 40px 0 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:${CREAM};border:1px solid ${BORDER};border-radius:12px;">
                <tr>
                  <td style="padding:14px 18px;font-family:Arial,Helvetica,sans-serif;">
                    <p style="margin:0;font-size:11px;letter-spacing:1px;color:${MUTED};text-transform:uppercase;">Order Number</p>
                    <p style="margin:2px 0 0;font-family:'Courier New',monospace;font-size:16px;font-weight:bold;color:${BRAND_PRIMARY};">#${escapeHtml(order.orderNumber)}</p>
                  </td>
                  <td align="right" style="padding:14px 18px;font-family:Arial,Helvetica,sans-serif;">
                    <p style="margin:0;font-size:11px;letter-spacing:1px;color:${MUTED};text-transform:uppercase;">Placed On</p>
                    <p style="margin:2px 0 0;font-size:14px;color:${TEXT};">${escapeHtml(formatDate(order.createdAt))}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Items -->
          <tr>
            <td style="background-color:#FFFFFF;padding:24px 40px 8px 40px;">
              <h2 style="margin:0 0 4px;font-family:Georgia,'Times New Roman',serif;font-size:17px;color:${TEXT};">Your Handmade Pieces</h2>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                ${rows}
              </table>
            </td>
          </tr>

          <!-- Totals -->
          <tr>
            <td style="background-color:#FFFFFF;padding:16px 40px 8px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" align="right" style="max-width:280px;">
                <tr>
                  <td style="padding:4px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:${MUTED};">Subtotal</td>
                  <td align="right" style="padding:4px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:${TEXT};">${money(order.subtotal)}</td>
                </tr>
                ${discountRow}
                <tr>
                  <td style="padding:4px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:${MUTED};">Shipping</td>
                  <td align="right" style="padding:4px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:${TEXT};">${shippingLabel}</td>
                </tr>
                <tr>
                  <td colspan="2" style="padding:10px 0 0 0;"><div style="border-top:2px solid ${TEXT};"></div></td>
                </tr>
                <tr>
                  <td style="padding:10px 0 0 0;font-family:Georgia,'Times New Roman',serif;font-size:17px;font-weight:bold;color:${TEXT};">Total</td>
                  <td align="right" style="padding:10px 0 0 0;font-family:Georgia,'Times New Roman',serif;font-size:19px;font-weight:bold;color:${BRAND_PRIMARY};">${money(order.total)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Shipping info -->
          <tr>
            <td style="background-color:#FFFFFF;padding:24px 40px 0 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:${CREAM};border:1px solid ${BORDER};border-radius:12px;">
                <tr>
                  <td style="padding:16px 18px;font-family:Arial,Helvetica,sans-serif;">
                    <p style="margin:0 0 6px;font-size:11px;letter-spacing:1px;color:${MUTED};text-transform:uppercase;">Delivering To</p>
                    <p style="margin:0;font-size:14px;line-height:21px;color:${TEXT};">${addressLines}</p>
                    ${order.shippingMethod ? `<p style="margin:8px 0 0;font-size:12px;color:${MUTED};">Delivery method: <strong style="color:${TEXT};">${escapeHtml(order.shippingMethod)}</strong></p>` : ""}
                    ${order.paymentMethod ? `<p style="margin:2px 0 0;font-size:12px;color:${MUTED};">Payment method: <strong style="color:${TEXT};">${escapeHtml(order.paymentMethod)}</strong></p>` : ""}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Note + CTA -->
          <tr>
            <td style="background-color:#FFFFFF;padding:24px 40px 32px 40px;text-align:center;">
              <p style="margin:0 0 20px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:21px;color:${MUTED};">
                Because every piece is made to order, please allow a little extra time before dispatch.
                We'll email you as soon as your parcel is on its way, complete with tracking details.
              </p>
              <a href="${baseUrl}/shop"
                 style="display:inline-block;background-color:${BRAND_PRIMARY};color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;letter-spacing:1px;text-decoration:none;padding:14px 34px;border-radius:999px;">
                 CONTINUE SHOPPING
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color:${CREAM};border-radius:0 0 16px 16px;border-top:1px solid ${BORDER};padding:22px 24px;">
              <p style="margin:0 0 4px;font-family:Georgia,'Times New Roman',serif;font-size:13px;color:${TEXT};">&#129526; ${APP_NAME}</p>
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:17px;color:${MUTED};">
                Questions? Simply reply to this email &mdash; we read every message.<br />
                &copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html, text, attachments };
}
