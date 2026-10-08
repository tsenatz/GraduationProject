import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

/**
 * Sends a 6-digit verification code email to the user using Resend.
 */
export async function sendVerificationEmail(email: string, token: string) {
  // If in development and no RESEND_API_KEY is configured yet, log to console for easy testing
  if (!resend) {
    console.log(`\n========================================`);
    console.log(`📧 [DEV EMAIL SIMULATION]`);
    console.log(`To: ${email}`);
    console.log(`Subject: Your ERNS Verification Code`);
    console.log(`Verification Code: ${token}`);
    console.log(`========================================\n`);
    return { success: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "ERNS <onboarding@resend.dev>",
      to: email,
      subject: `${token} is your ERNS verification code`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 24px; }
            .container { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); }
            .logo { font-size: 24px; font-weight: 800; color: #0f172a; margin-bottom: 20px; }
            .title { font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
            .text { font-size: 15px; line-height: 24px; color: #475569; margin-bottom: 24px; }
            .code-box { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; text-align: center; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #0f172a; font-family: monospace; margin-bottom: 24px; }
            .footer { font-size: 13px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 16px; margin-top: 24px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">🏠 ERNS</div>
            <div class="title">Verify your email address</div>
            <div class="text">
              Welcome to ERNS! To complete your registration and activate your account, please enter the following 6-digit verification code:
            </div>
            <div class="code-box">${token}</div>
            <div class="text">
              This code will expire in <strong>15 minutes</strong>. If you did not create an account on ERNS, please ignore this email.
            </div>
            <div class="footer">
              © ${new Date().getFullYear()} ERNS - Ethio Rents And Sales. All rights reserved.
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Resend email error:", error);
      return { error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Failed to send verification email:", err);
    return { error: "Failed to dispatch verification email" };
  }
}
