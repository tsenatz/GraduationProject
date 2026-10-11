"use server";

import db from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";

export const agentApplicationSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters").max(100),
  fullNameAm: z.string().trim().max(100).optional().default(""),
  phone: z.string().trim().min(9, "Valid phone number required").max(20),
  email: z.string().trim().email("Valid email required"),
  agency: z.string().trim().min(2, "Brokerage/Agency name required").max(100),
  experience: z.string().trim().max(50).default("3 - 5 years"),
  selectedSubCities: z.array(z.string().trim()).min(1, "Select at least one sub-city"),
  specialties: z.array(z.string().trim()).min(1, "Select at least one specialty"),
  languages: z.array(z.string().trim()).default(["Amharic", "English"]),
  tinNumber: z.string().trim().min(3, "TIN or Business License number required").max(50),
  documentUrl: z.string().trim().optional().default(""),
  attachedFileName: z.string().trim().optional().default(""),
  bio: z.string().trim().max(2000).optional().default(""),
  website: z.string().trim().max(200).optional().default(""),
  agreedToTerms: z.boolean().refine((val) => val === true, "Must accept terms and code of ethics"),
});

export type AgentApplicationInput = z.infer<typeof agentApplicationSchema>;

// Memory fallback for local demo when DB is not configured
declare const globalThis: {
  mockAgentApplications?: Record<string, any>;
} & typeof global;

if (!globalThis.mockAgentApplications) {
  globalThis.mockAgentApplications = {};
}

export async function applyAsAgentAction(rawData: AgentApplicationInput) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        error: "AUTH_REQUIRED",
        isAuthenticated: false,
      };
    }

    const userId = session.user.id;

    // Strict Zod Validation
    const validation = agentApplicationSchema.safeParse(rawData);
    if (!validation.success) {
      const firstIssue = validation.error.issues[0]?.message || "Invalid application data";
      return {
        success: false,
        error: firstIssue,
        isAuthenticated: true,
      };
    }

    const data = validation.data;
    const referenceNo = `ERN-AG-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    let savedProfile: any = null;

    try {
      savedProfile = await db.$transaction(async (tx) => {
        // Upsert Agent Profile
        const profile = await tx.agentProfile.upsert({
          where: { userId },
          create: {
            userId,
            fullName: data.fullName,
            fullNameAm: data.fullNameAm,
            tinNumber: data.tinNumber,
            licenseNumber: data.tinNumber,
            brokerage: data.agency,
            experience: data.experience,
            specialties: data.specialties,
            languages: data.languages,
            professionalPhone: data.phone,
            professionalEmail: data.email,
            bio: data.bio,
            website: data.website,
            documentUrl: data.documentUrl || data.attachedFileName,
            referenceNo,
            serviceAreas: data.selectedSubCities,
            verificationStatus: "PENDING",
          },
          update: {
            fullName: data.fullName,
            fullNameAm: data.fullNameAm,
            tinNumber: data.tinNumber,
            licenseNumber: data.tinNumber,
            brokerage: data.agency,
            experience: data.experience,
            specialties: data.specialties,
            languages: data.languages,
            professionalPhone: data.phone,
            professionalEmail: data.email,
            bio: data.bio,
            website: data.website,
            documentUrl: data.documentUrl || data.attachedFileName,
            referenceNo,
            serviceAreas: data.selectedSubCities,
            verificationStatus: "PENDING",
          },
        });

        return profile;
      });
    } catch (dbErr) {
      // Memory fallback for demo mode
      const mockRecord = {
        userId,
        fullName: data.fullName,
        tinNumber: data.tinNumber,
        brokerage: data.agency,
        experience: data.experience,
        specialties: data.specialties,
        languages: data.languages,
        professionalPhone: data.phone,
        professionalEmail: data.email,
        bio: data.bio,
        referenceNo,
        serviceAreas: data.selectedSubCities,
        documentUrl: data.documentUrl || data.attachedFileName,
        verificationStatus: "PENDING",
        createdAt: new Date().toISOString(),
      };
      globalThis.mockAgentApplications![userId] = mockRecord;
      savedProfile = mockRecord;
    }

    revalidatePath("/sell/agent/apply");
    revalidatePath("/sell/agent");

    return {
      success: true,
      referenceNo,
      profile: savedProfile,
      isAuthenticated: true,
    };
  } catch (error) {
    console.error("Agent application action error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to submit agent application",
      isAuthenticated: true,
    };
  }
}

export async function getAgentApplicationAction() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: "AUTH_REQUIRED", profile: null };
    }

    const userId = session.user.id;
    let profile: any = null;

    try {
      profile = await db.agentProfile.findUnique({
        where: { userId },
      });
    } catch {
      profile = globalThis.mockAgentApplications?.[userId] || null;
    }

    return {
      success: true,
      profile,
    };
  } catch (error) {
    console.error("Error fetching agent profile:", error);
    return { success: false, error: "Failed to load agent profile", profile: null };
  }
}
