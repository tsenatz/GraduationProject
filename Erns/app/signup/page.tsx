"use client";

import { useState } from "react";
import Link from "next/link";

import { AuthPageLayout } from "@/components/auth/AuthPageLayout";
import { AuthImagePanel } from "@/components/auth/AuthImagePanel";
import { AuthTabs } from "@/components/auth/AuthTabs";
import { FormInput } from "@/components/auth/FormInput";
import { SocialLoginButtons } from "@/components/auth/SocialLoginButtons";

import styles from "./signup.module.css";

const CAROUSEL_ITEMS = [
  {
    title: "Start your journey",
    desc: (
      <>
        Join thousands of satisfied users.<br />
        Your dream property is one step away.
      </>
    ),
  },
  {
    title: "Discover prime locations",
    desc: (
      <>
        Explore properties in the best neighborhoods<br />
        for a vibrant lifestyle.
      </>
    ),
  },
  {
    title: "Your dream investment",
    desc: (
      <>
        Secure the best deals in real estate<br />
        with our expert guidance.
      </>
    ),
  },
];

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Signup form submitted: ", formData);
  };

  return (
    <AuthPageLayout
      imagePanelSlot={
        <AuthImagePanel imageSrc="/signup.png" carouselItems={CAROUSEL_ITEMS} />
      }
      formSectionClassName={styles.formSectionOverflow}
      formSectionSlot={
        <>
          <AuthTabs activeTab="signup" />

          <div className={styles.formWrapper}>
            <div className={styles.formHeader}>
              <h2>Join ERNS Today!</h2>
              <p>Create your account to get started</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className={styles.row}>
                <FormInput
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <FormInput
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <FormInput
                id="email"
                name="email"
                type="email"
                label="Your Email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <div className={styles.row}>
                <FormInput
                  id="password"
                  name="password"
                  type="password"
                  label="Create Password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <FormInput
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  label="Confirm Password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className={styles.loginBtn}>
                Create Account
              </button>
            </form>

            <div className={styles.divider}>
              <span>Or Sign Up With</span>
            </div>

            <SocialLoginButtons />

            <div className={styles.registerText}>
              Already have an account?
              <Link href="/login" className={styles.registerLink}>
                Log in
              </Link>
            </div>
          </div>
        </>
      }
    />
  );
}