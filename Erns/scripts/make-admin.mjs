#!/usr/bin/env node

/**
 * Script to promote a user to ADMIN in the ERNS database.
 * Usage:
 *   node scripts/make-admin.mjs your-email@example.com
 *   or: npm run make-admin your-email@example.com
 */

import { Pool } from "pg";
import fs from "fs";
import path from "path";

// 1. Read .env file for DATABASE_URL
let databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8");
    for (const line of envContent.split("\n")) {
      const trimmed = line.trim();
      if (trimmed.startsWith("DATABASE_URL=")) {
        databaseUrl = trimmed.substring("DATABASE_URL=".length).replace(/^["']|["']$/g, "");
        break;
      }
    }
  }
}

if (!databaseUrl) {
  console.error("Error: DATABASE_URL not found in environment or .env file.");
  process.exit(1);
}

const targetEmail = process.argv[2]?.trim().toLowerCase();

if (!targetEmail) {
  console.log("Usage: node scripts/make-admin.mjs <user-email>");
  console.log("Example: node scripts/make-admin.mjs admin@erns.et");
  process.exit(1);
}

const pool = new Pool({ connectionString: databaseUrl });

async function main() {
  try {
    console.log(`Checking user with email: "${targetEmail}"...`);
    const checkRes = await pool.query(
      `SELECT id, name, email, role FROM "User" WHERE LOWER(email) = LOWER($1)`,
      [targetEmail]
    );

    if (checkRes.rows.length === 0) {
      console.error(`User not found with email: "${targetEmail}"`);
      console.log(`Please sign up or log in first in the app, then run this command again.`);
      process.exit(1);
    }

    const user = checkRes.rows[0];
    if (user.role === "ADMIN") {
      console.log(`User "${user.email}" (${user.name || "No name"}) is already an ADMIN.`);
      process.exit(0);
    }

    await pool.query(
      `UPDATE "User" SET role = 'ADMIN', "updatedAt" = NOW() WHERE id = $1`,
      [user.id]
    );

    console.log(`Success! User "${user.email}" (${user.name || "User"}) has been promoted to role ADMIN.`);
    console.log(`You can now sign in and access http://localhost:3000/admin.`);
  } catch (err) {
    console.error("Database error:", err.message);
  } finally {
    await pool.end();
  }
}

main();
