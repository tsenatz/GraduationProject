import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";

import db from "@/lib/db";
import { loginSchema } from "@/lib/schema";

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
        // 1. Validate inputs with Zod
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;

        // 2. Find user in database
        const user = await db.user.findUnique({
          where: { email },
        });

        // If user doesn't exist or doesn't have a password (e.g. OAuth only user)
        if (!user || !user.password) {
          return null;
        }

        // 3. Verify password
        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) {
          return null;
        }

        // 4. Ensure email is verified
        if (!user.emailVerified) {
          return null;
        }

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