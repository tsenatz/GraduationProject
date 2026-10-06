"use server";

import bcrypt from "bcryptjs";
import db from "@/lib/db";
import { signupSchema } from "@/lib/schema";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export type ActionResponse = {
  success?: boolean;
  error?: string;
  email?: string;
  maskedPhone?: string;
};

/**
 * Server Action for registering a new Consumer User.
 * Generates a 6-digit verification code and emails it via Resend.
 */
export async function registerUser(data: unknown): Promise<ActionResponse> {
  // 1. Validate inputs with Zod
  const parsed = signupSchema.safeParse(data);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { error: issue?.message || "Invalid form data" };
  }

  const { firstName, lastName, email, password } = parsed.data;

  try {
    // 2. Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // If user exists and is already verified
      if (existingUser.emailVerified) {
        return { error: "An account with this email already exists. Please log in." };
      }
      
      // If user exists but is unverified, update password & resend verification code
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.user.update({
        where: { email },
        data: {
          name: `${firstName} ${lastName}`,
          firstName,
          lastName,
          password: hashedPassword,
        },
      });

      const tokenObj = await generateVerificationToken(email);
      await sendVerificationEmail(email, tokenObj.token);
      return { success: true, email };
    }

    // 3. Securely hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create standard user with unverified email
    await db.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: "USER",
        emailVerified: null,
      },
    });

    // 5. Generate and dispatch verification code
    const tokenObj = await generateVerificationToken(email);
    await sendVerificationEmail(email, tokenObj.token);

    return { success: true, email };
  } catch (error) {
    console.error("Error registering user:", error);
    return { error: "Something went wrong while creating your account. Please try again." };
  }
}

/**
 * Server Action to verify the submitted 6-digit code.
 */
export async function verifyEmailCode(email: string, code: string): Promise<ActionResponse> {
  if (!email || !code || code.trim().length !== 6) {
    return { error: "Please enter a valid 6-digit verification code." };
  }

  try {
    // 1. Find matching token
    const existingToken = await db.verificationToken.findFirst({
      where: {
        identifier: email,
        token: code.trim(),
      },
    });

    if (!existingToken) {
      return { error: "Invalid verification code. Please check and try again." };
    }

    // 2. Check expiration
    const isExpired = new Date(existingToken.expires) < new Date();
    if (isExpired) {
      return { error: "This verification code has expired. Please request a new code." };
    }

    // 3. Update User as verified
    await db.user.update({
      where: { email },
      data: {
        emailVerified: new Date(),
      },
    });

    // 4. Delete used verification token
    await db.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: email,
          token: code.trim(),
        },
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error verifying email code:", error);
    return { error: "Failed to verify code. Please try again." };
  }
}

/**
 * Server Action to resend a fresh 6-digit verification code.
 */
export async function resendVerificationCode(email: string): Promise<ActionResponse> {
  if (!email) {
    return { error: "Email is required." };
  }

  try {
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { error: "Account not found." };
    }

    if (user.emailVerified) {
      return { error: "Your email is already verified. Please log in." };
    }

    const tokenObj = await generateVerificationToken(email);
    await sendVerificationEmail(email, tokenObj.token);

    return { success: true };
  } catch (error) {
    console.error("Error resending verification code:", error);
    return { error: "Failed to resend code. Please try again." };
  }
}

/**
 * Normalizes an Ethiopian phone number to international E.164 format (+2519XXXXXXXX or +2517XXXXXXXX).
 */
function normalizeEthiopianPhone(input: string): string | null {
  if (!input) return null;
  const cleaned = input.replace(/[\s\-\(\)]/g, "");

  if (/^\+251[79]\d{8}$/.test(cleaned)) {
    return cleaned;
  }
  if (/^251[79]\d{8}$/.test(cleaned)) {
    return `+${cleaned}`;
  }
  if (/^0[79]\d{8}$/.test(cleaned)) {
    return `+251${cleaned.slice(1)}`;
  }
  if (/^[79]\d{8}$/.test(cleaned)) {
    return `+251${cleaned}`;
  }

  return null;
}

/**
 * Masks a normalized phone number for secure display (e.g., +251 9•• ••• •89).
 */
function maskPhoneNumber(normalizedPhone: string): string {
  if (normalizedPhone.length === 13 && normalizedPhone.startsWith("+251")) {
    return `+251 ${normalizedPhone[4]}•• ••• •${normalizedPhone.slice(-2)}`;
  }
  return normalizedPhone;
}

/**
 * Server Action to dispatch a 6-digit phone verification OTP via SMS or Voice Call.
 */
export async function sendPhoneVerificationCode(
  phoneNumber: string,
  method: "SMS" | "VOICE" = "SMS"
): Promise<ActionResponse> {
  const normalizedPhone = normalizeEthiopianPhone(phoneNumber);

  if (!normalizedPhone) {
    return {
      error:
        "Please enter a valid Ethiopian mobile number (e.g., 911 234 567 or 711 234 567).",
    };
  }

  try {
    // Rate Limiting Security Check: prevent spamming/bombing within 60s
    const existingToken = await db.verificationToken.findFirst({
      where: { identifier: normalizedPhone },
      orderBy: { expires: "desc" },
    });

    if (existingToken) {
      // Tokens expire in 15 minutes (900s). If issued less than 60s ago, cooldown is active.
      const msUntilExpiry = new Date(existingToken.expires).getTime() - Date.now();
      const elapsedMs = 15 * 60 * 1000 - msUntilExpiry;
      if (elapsedMs < 60 * 1000) {
        const remainingSeconds = Math.ceil((60 * 1000 - elapsedMs) / 1000);
        return {
          error: `Please wait ${remainingSeconds}s before requesting another verification code.`,
        };
      }
    }

    // Generate fresh 6-digit cryptographic OTP token
    const tokenObj = await generateVerificationToken(normalizedPhone);

    // In local development or until Twilio/local SMS gateway is plugged in,
    // safely log the verification code to server console.
    console.log(
      `\x1b[32m[Phone Verification]\x1b[0m 6-digit code for ${normalizedPhone} (${method}): \x1b[1m${tokenObj.token}\x1b[0m`
    );

    return {
      success: true,
      maskedPhone: maskPhoneNumber(normalizedPhone),
    };
  } catch (error) {
    console.error("Error generating phone verification code:", error);
    return { error: "Failed to send verification code. Please try again." };
  }
}

/**
 * Server Action to verify the submitted 6-digit phone verification code.
 */
export async function verifyPhoneCode(
  phoneNumber: string,
  code: string
): Promise<ActionResponse> {
  const normalizedPhone = normalizeEthiopianPhone(phoneNumber);

  if (!normalizedPhone) {
    return { error: "Invalid phone number." };
  }

  if (!code || code.trim().length !== 6) {
    return { error: "Please enter the full 6-digit verification code." };
  }

  try {
    const existingToken = await db.verificationToken.findUnique({
      where: {
        identifier_token: {
          identifier: normalizedPhone,
          token: code.trim(),
        },
      },
    });

    if (!existingToken) {
      return { error: "Invalid verification code. Please check and try again." };
    }

    if (new Date(existingToken.expires) < new Date()) {
      return { error: "This code has expired. Please request a new code." };
    }

    // Securely delete token upon successful verification so it cannot be re-used
    await db.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: normalizedPhone,
          token: code.trim(),
        },
      },
    });

    return {
      success: true,
      maskedPhone: maskPhoneNumber(normalizedPhone),
    };
  } catch (error) {
    console.error("Error verifying phone code:", error);
    return { error: "Failed to verify phone code. Please try again." };
  }
}

