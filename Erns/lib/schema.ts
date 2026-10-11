import { z } from "zod";

// Schema for user Login
export const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

// Schema for user Registration / Sign-up
export const signupSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, "First name must be at least 2 characters long"),
    lastName: z
      .string()
      .trim()
      .min(2, "Last name must be at least 2 characters long"),
    email: z.string().trim().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;

// Schema for property listings (FSBO & Agent) with validation and security limits
export const propertyListingSchema = z.object({
  subCity: z.string().trim().min(2, "Sub-city is required").max(60),
  woreda: z.string().trim().max(60).optional().default(""),
  specificArea: z.string().trim().min(2, "Specific area is required").max(100),
  propertyType: z.string().trim().min(2).max(40),
  bedrooms: z.number().int().min(1, "At least 1 bedroom required").max(50),
  bathrooms: z.number().min(1, "At least 1 bathroom required").max(30),
  areaSqM: z.number().min(10, "Minimum 10 m² required").max(50000),
  priceETB: z.number().positive("Price must be a positive number").max(10000000000),
  isNegotiable: z.boolean().default(true),
  titleDeedStatus: z.string().trim().max(40).optional().default("digital"),
  amenities: z.array(z.string().trim().max(100)).max(50).default([]),
  description: z.string().trim().max(4000).optional().default(""),
  ownerName: z.string().trim().min(2, "Owner name must be at least 2 characters").max(100),
  phone: z.string().trim().min(7, "Valid phone number required").max(20),
  preferredTime: z.string().trim().max(50).optional().default("anytime"),
  photos: z.array(z.string().trim()).max(30).default([]),
});

export type PropertyListingInput = z.infer<typeof propertyListingSchema>;

