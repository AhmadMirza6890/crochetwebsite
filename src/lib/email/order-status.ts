import { APP_NAME, APP_URL } from "@/lib/constants";
import { ORDER_STATUSES } from "@/lib/constants";

export interface OrderStatusEmailData {
  orderNumber: string;
  customerName: string;
  status: string;
  trackingNumber?: string | null;
  trackingUrl?: string | null;
}

const BRAND_PRIMARY = "#8C4A2B";
const BRAND_DARK = "#5C3A21";
const TEXT = "#3E2F23";
const MUTED = "#8A7563";
const CREAM = "#FAF6F0";
const BORDER = "#EADFCE";

const STATUS_MESSAGES: Record<string, string> = {
  PENDING: "We have received your order and will confirm it shortly.",
  CONFIRMED: "Great news — your order has been confirmed and added to our making queue!",
  PROCESSING: "We are busy preparing the softest yarns for your order.",
  HANDMADE_IN_PRODUCTION: "Your piece is being crocheted by hand right now, stitch by stitch.",
  SHIPPED: "Exciting news! Your parcel has left our studio and is on its way to you.",
  DELIVERED: "Your order has been delivered. We hope you love your handmade piece!",
  CANCELLED: "Your order has been cancelled. If this was a mistake, please contact us and we'll help.",
  REFUNDED: "A refund for your order has been processed and should reach you soon.",
};

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function buildOrderStatusEmail(order: OrderStatusEmailData): {
  subject: string;
  html: string;
  text: string;
} {
  const firstName = order.customerName.trim().split(/\s+/)[0] || "there";
  const statusLabel = ORDER_STATUSES[order.status as keyof typeof ORDER_STATUSES]?.label ?? order.status;
  const message = STATUS_MESSAGES[order.status] ?? `The status of your order is now "${statusLabel}".`;
  const showTracking = Boolean(order.trackingNumber || order.trackingUrl);

  const subject = `Order #${order.orderNumber} — ${statusLabel} | ${APP_NAME}`;

  const text = [
    `Hi ${firstName},`,
    "",
    `Update on your ${APP_NAME} order #${order.orderNumber}:`,
    message,
    ...(showTracking
      ? ["", `Tracking number: ${order.trackingNumber ?? "-"}`, order.trackingUrl ? `Track at: ${order.trackingUrl}` : ""]
      : []),
    "",
    `You can also track anytime: ${APP_URL}/track-order?orderNumber=${order.orderNumber}`,
    "",
    `${APP_NAME}`,
  ]
    .filter(Boolean)
    .join("\n");

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:0;background-color:#F3EBE1;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#F3EBE1;padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;width:100%;">

          <tr>
            <td align="center" style="background-color:${BRAND_DARK};border-radius:16px 16px 0 0;padding:24px;">
              <div style="width:48px;height:48px;line-height:48px;margin:0 auto 8px;text-align:center;font-size:24px;background:${BRAND_PRIMARY};border-radius:50%;">&#129526;</div>
              <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:18px;letter-spacing:3px;color:#FFF8EF;text-transform:uppercase;">Hearthside Yarn</p>
            </td>
          </tr>

          <tr>
            <td style="background-color:#FFFFFF;padding:32px 40px;text-align:center;">
              <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:2px;color:${BRAND_PRIMARY};text-transform:uppercase;">Order Update &middot; #${escapeHtml(order.orderNumber)}</p>
              <h1 style="margin:0 0 12px;font-family:Georgia,'Times New Roman',serif;font-size:26px;color:${TEXT};">${escapeHtml(statusLabel)}</h1>
              <p style="margin:0 auto;max-width:420px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:22px;color:${MUTED};">
                Hi ${escapeHtml(firstName)}, ${escapeHtml(message)}
              </p>

              ${
                showTracking
                  ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:20px;background-color:${CREAM};border:1px solid ${BORDER};border-radius:12px;">
                      <tr>
                        <td style="padding:14px 18px;font-family:'Courier New',monospace;font-size:15px;font-weight:bold;color:${BRAND_PRIMARY};text-align:center;">
                          Tracking: ${escapeHtml(order.trackingNumber ?? "See link")}
                        </td>
                      </tr>${
                        order.trackingUrl
                          ? `<tr><td style="padding:0 18px 14px 18px;text-align:center;">
                              <a href="${escapeHtml(order.trackingUrl)}" style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${BRAND_PRIMARY};">Track your parcel &rarr;</a>
                            </td></tr>`
                          : ""
                      }
                    </table>`
                  : ""
              }

              <a href="${APP_URL}/track-order?orderNumber=${encodeURIComponent(order.orderNumber)}"
                 style="display:inline-block;margin-top:24px;background-color:${BRAND_PRIMARY};color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;letter-spacing:1px;text-decoration:none;padding:12px 30px;border-radius:999px;">
                 TRACK MY ORDER
              </a>
            </td>
          </tr>

          <tr>
            <td align="center" style="background-color:${CREAM};border-radius:0 0 16px 16px;border-top:1px solid ${BORDER};padding:18px;">
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:17px;color:${MUTED};">
                Questions? Simply reply to this email.<br />
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

  return { subject, html, text };
}
