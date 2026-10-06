import db from "@/lib/db";

/**
 * Generates a 6-digit numeric verification code and stores it in the database.
 * Previous tokens for the same email are invalidated.
 */
export async function generateVerificationToken(email: string) {
  // Generate random 6-digit OTP (e.g. "582914")
  const token = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Expiration time: 15 minutes from now
  const expires = new Date(Date.now() + 15 * 60 * 1000);

  // Invalidate any existing verification token for this email
  await db.verificationToken.deleteMany({
    where: { identifier: email },
  });

  // Create new verification token in database
  const verificationToken = await db.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  });

  return verificationToken;
}
