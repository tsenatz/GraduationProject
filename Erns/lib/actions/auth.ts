"use server";

import bcrypt from "bcryptjs";
import db from "@/lib/db";
import { signupSchema } from "@/lib/schema";

export type ActionResponse = {
  success?: boolean;
  error?: string;
};

/**
 * Server Action for registering a new Consumer User.
 * Every user starts as a standard USER role (Zillow pattern).
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
      return { error: "An account with this email already exists." };
    }

    // 3. Securely hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create standard user in database
    await db.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: "USER",
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error creating user:", error);
    return { error: "Something went wrong while creating your account. Please try again." };
  }
}
