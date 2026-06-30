import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST || "";
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587;
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const SMTP_FROM = process.env.SMTP_FROM || "NexaStock <no-reply@nexastock.com>";

let transporter: nodemailer.Transporter | null = null;

if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
  console.log("📧 [EMAIL] Initializing SMTP transporter...");
  console.log(`   Host: ${SMTP_HOST}`);
  console.log(`   Port: ${SMTP_PORT}`);
  console.log(`   User: ${SMTP_USER}`);
  console.log(`   Pass: ${SMTP_PASS.substring(0, 4)}****`);
  
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });
  console.log("✓ [EMAIL] SMTP transporter initialized successfully");
} else {
  console.log("⚠️  [EMAIL] SMTP credentials not configured - using mock mode");
  console.log(`   SMTP_HOST: ${SMTP_HOST || 'NOT SET'}`);
  console.log(`   SMTP_USER: ${SMTP_USER || 'NOT SET'}`);
  console.log(`   SMTP_PASS: ${SMTP_PASS ? 'SET' : 'NOT SET'}`);
}

export interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendMail(options: MailOptions): Promise<boolean> {
  if (!transporter) {
    console.log("=========================================");
    console.log(`[MOCK EMAIL SENT TO: ${options.to}]`);
    console.log(`Subject: ${options.subject}`);
    console.log("HTML Body Preview:");
    // Print first 400 chars of HTML body for preview
    console.log(options.html.substring(0, 400) + "...");
    console.log("=========================================");
    return true;
  }

  try {
    console.log(`[EMAIL] Attempting to send email to: ${options.to}`);
    const result = await transporter.sendMail({
      from: SMTP_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html
    });
    console.log(`[EMAIL] ✓ Email sent successfully to ${options.to}. MessageId: ${result.messageId}`);
    return true;
  } catch (err: any) {
    console.error("[EMAIL] ✗ SMTP sending failed:", err.message);
    console.error("[EMAIL] Full error:", err);
    throw err;
  }
}

export function getBrandedInvitationTemplate(
  fullName: string,
  workspaceName: string,
  roleLabel: string,
  inviteLink: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Join ${workspaceName} on NexaStock</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #0b0f19;
      color: #f3f4f6;
      margin: 0;
      padding: 0;
    }
    .wrapper {
      padding: 30px 15px;
      background-color: #0b0f19;
    }
    .container {
      max-width: 580px;
      margin: 0 auto;
      background-color: #111827;
      border: 1px solid #1f2937;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3);
    }
    .header {
      padding: 30px;
      text-align: center;
      background: linear-gradient(135deg, #a78bfa 0%, #6366f1 100%);
      color: #ffffff;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      letter-spacing: -0.5px;
    }
    .content {
      padding: 30px;
      line-height: 1.6;
      background-color: #111827;
    }
    h1 {
      font-size: 20px;
      margin-top: 0;
      color: #ffffff;
    }
    p {
      margin-bottom: 20px;
      color: #9ca3af;
    }
    .badge {
      display: inline-block;
      padding: 4px 8px;
      background-color: #374151;
      border: 1px solid #4b5563;
      border-radius: 6px;
      font-size: 12px;
      color: #e5e7eb;
      font-weight: 600;
    }
    .button-container {
      text-align: center;
      margin: 30px 0;
    }
    .btn {
      display: inline-block;
      padding: 12px 24px;
      background: linear-gradient(180deg, #6366f1 0%, #4f46e5 100%);
      color: #ffffff !important;
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.4);
    }
    .footer {
      padding: 20px 30px;
      background-color: #0f172a;
      border-top: 1px solid #1e293b;
      text-align: center;
      font-size: 11px;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <div class="logo">NexaStock</div>
      </div>
      <div class="content">
        <h1 style="color:#ffffff;">You've been invited!</h1>
        <p>Hi ${fullName},</p>
        <p>You have been invited to join the <strong>${workspaceName}</strong> organization on NexaStock.</p>
        <p>Your assigned role will be: <span class="badge">${roleLabel}</span></p>
        <p>Please click the button below to accept your invitation, set up your secure password, and access your workspace.</p>
        <div class="button-container">
          <a href="${inviteLink}" class="btn" target="_blank" style="color:#ffffff;">Join Workspace</a>
        </div>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; font-family: monospace; font-size: 11px; background-color: #1f2937; padding: 10px; border-radius: 8px; color: #a78bfa;">
          ${inviteLink}
        </p>
        <p>This invitation link will expire in 7 days.</p>
      </div>
      <div class="footer">
        © 2026 NexaStock AI Platform. All rights reserved.<br>
        If you did not expect this invitation, you can safely ignore this email.
      </div>
    </div>
  </div>
</body>
</html>
  `;
}
