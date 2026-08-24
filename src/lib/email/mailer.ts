import nodemailer from "nodemailer";
import { APP_NAME } from "@/lib/constants";

function isSmtpConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST);
}

async function getTransporter() {
  const port = Number(process.env.SMTP_PORT) || 587;
  const host = process.env.SMTP_HOST as string;

  return nodemailer.createTransport({
    host,
    port,
    // Gmail: port 587 = STARTTLS (secure:false), port 465 = implicit TLS (secure:true)
    secure: port === 465,
    requireTLS: port !== 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    // Some hosts (esp. Gmail) need a longer greeting timeout
    connectionTimeout: 15000,
    greetingTimeout: 10000,
  });
}

export interface MailAttachment {
  filename: string;
  content: Buffer;
  cid?: string; // content-id for inline <img src="cid:...">
  contentType?: string;
}

export interface MailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: MailAttachment[];
}

/**
 * Sends an email via SMTP when configured. In development (no SMTP env vars)
 * the full email is logged to the server console instead, so the flow stays
 * testable without credentials.
 *
 * Setup (Gmail):
 *   1. Enable 2-Step Verification on the Google account.
 *   2. Create an App Password: https://myaccount.google.com/apppasswords
 *   3. In .env set:
 *        SMTP_HOST="smtp.gmail.com"
 *        SMTP_PORT="587"
 *        SMTP_USER="youremail@gmail.com"
 *        SMTP_PASSWORD="your-16-char-app-password"
 *        EMAIL_FROM="Hearthside Yarn <youremail@gmail.com>"
 */
export async function sendMail(payload: MailPayload): Promise<{ delivered: boolean; error?: string }> {
  if (!isSmtpConfigured()) {
    console.log(
      `\n[email] SMTP not configured — email NOT sent. Fill SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASSWORD in .env to enable delivery.\n` +
        `[email] To: ${payload.to}\n` +
        `[email] Subject: ${payload.subject}\n`
    );
    return { delivered: false, error: "SMTP not configured" };
  }

  try {
    const transporter = await getTransporter();
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || `${APP_NAME} <${process.env.SMTP_USER}>`,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
      attachments: payload.attachments,
    });
    console.log(`[email] Sent to ${payload.to}: ${info.messageId}`);
    return { delivered: true };
  } catch (error: any) {
    console.error("[email] Failed to send email:", error?.message || error);
    return { delivered: false, error: error?.message || String(error) };
  }
}
