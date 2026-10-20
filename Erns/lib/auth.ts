import NextAuth, { CredentialsSignin } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";

import db from "@/lib/db";
import { loginSchema } from "@/lib/schema";
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limit";

class LoginRateLimitError extends CredentialsSignin {
  code = "RATE_LIMIT_EXCEEDED";
}

class EmailNotVerifiedError extends CredentialsSignin {
  code = "EMAIL_NOT_VERIFIED";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  providers: [
    Google({
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        // 1. Input Integrity: Validate inputs with Zod
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;
        const normalizedEmail = email.toLowerCase().trim();

        // 2. CIA Triad - Availability & Confidentiality:
        // Defend against brute-force password guessing and credential stuffing attacks
        const rateLimitKey = `login:${normalizedEmail}`;
        const rateLimit = checkRateLimit(rateLimitKey, {
          limit: 5,
          windowMs: 60 * 1000,
        });

        if (!rateLimit.success) {
          throw new LoginRateLimitError();
        }

        // 3. Find user by email
        const user = await db.user.findUnique({
          where: { email: normalizedEmail },
        });

        if (!user || !user.password) {
          return null;
        }

        // 4. Confidentiality & Integrity: Constant-time bcrypt verification
        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) {
          return null;
        }

        // 5. Integrity: Enforce verified email status before session issuance
        if (!user.emailVerified) {
          throw new EmailNotVerifiedError();
        }

        // Successful authentication: Reset failed login count
        resetRateLimit(rateLimitKey);

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id || token.sub;
        token.role = (user as { role?: string }).role || "USER";
      }
      if (!token.id && token.sub) {
        token.id = token.sub;
      }
      if (token.email && (!token.id || /^\d+$/.test(String(token.id)))) {
        try {
          const dbUser = await db.user.findUnique({
            where: { email: token.email },
            select: { id: true, role: true },
          });
          if (dbUser) {
            token.id = dbUser.id;
            token.role = dbUser.role || token.role || "USER";
          }
        } catch {
          // Ignore fallback error
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = (token.id as string) || (token.sub as string);
        (session.user as { role?: string }).role = (token.role as string) || "USER";
      }
      return session;
    },
  },
});