"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Home, Check } from "lucide-react";
import { GoogleIcon, AppleIcon, FacebookIcon } from "@/components/icons/SocialIcons";
import styles from "./login.module.css";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselItems = [
    {
      title: "Find your sweet home",
      desc: (
        <>
          Schedule visit in just a few clicks<br />
          visits in just a few clicks
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className={styles.container}>
      {/* Left Image Section */}
      <section className={styles.imageSection}>
        <div className={styles.imageWrapper}>
          <Image
            src="/signin.png"
            alt="Modern Architecture Home"
            fill
            priority
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className={styles.imageOverlay} />

        <Link href="/" className={styles.logoArea}>
          <div className={styles.logoIcon}>
            <Home size={20} strokeWidth={2.5} />
          </div>
          <span className={styles.logoText}>ERNS</span>
        </Link>

        <div className={styles.imageContent}>
          <div className={styles.textContent} key={currentSlide}>
            <h1>{carouselItems[currentSlide].title}</h1>
            <p>{carouselItems[currentSlide].desc}</p>
          </div>
          <div className={styles.dots}>
            {carouselItems.map((_, index) => (
              <div
                key={index}
                className={`${styles.dot} ${currentSlide === index ? styles.active : ""
                  }`}
                onClick={() => setCurrentSlide(index)}
                style={{ cursor: "pointer" }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Right Form Section */}
      <section className={styles.formSection}>
        <div className={styles.topTabs}>
          <Link href="/login" className={`${styles.tab} ${styles.activeTab}`}>
            Sign In
          </Link>
          <Link href="/signup" className={styles.tab}>
            Sign Up
          </Link>
        </div>

        <div className={styles.formWrapper}>
          <div className={styles.formHeader}>
            <h2>Welcome Back to ERNS!</h2>
            <p>Sign in your account</p>
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            <div className={styles.inputGroup}>
              <label htmlFor="email">Your Email</label>
              <div className={styles.inputWrapper}>
                <input
                  type="email"
                  id="email"
                  className={styles.input}
                  placeholder="info.madhu786@gmail.com"
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password">Password</label>
              <div className={styles.inputWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className={styles.input}
                  placeholder="••••••••"
                />
                {showPassword ? (
                  <EyeOff
                    size={20}
                    className={styles.eyeIcon}
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <Eye
                    size={20}
                    className={styles.eyeIcon}
                    onClick={() => setShowPassword(true)}
                  />
                )}
              </div>
            </div>

            <div className={styles.formOptions}>
              <div
                className={styles.rememberMe}
                onClick={() => setRememberMe(!rememberMe)}
              >
                <div className={`${styles.checkbox} ${rememberMe ? styles.checked : ''}`}>
                  {rememberMe && <Check size={12} strokeWidth={3} />}
                </div>
                <span>Remember Me</span>
              </div>
              <Link href="/forgot-password" className={styles.forgotPassword}>
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className={styles.loginBtn}>
              Login
            </button>
          </form>

          <div className={styles.divider}>
            <span>Instant Login</span>
          </div>

          <div className={styles.socialLogin}>
            <button type="button" className={styles.socialBtn}>
              <GoogleIcon className={styles.socialIcon} />
            </button>
            <button type="button" className={styles.socialBtn}>
              <AppleIcon className={styles.socialIcon} />
            </button>
            <button type="button" className={styles.socialBtn}>
              <FacebookIcon className={styles.socialIcon} />
            </button>
          </div>

          <div className={styles.registerText}>
            Don't have any account?
            <Link href="/signup" className={styles.registerLink}>
              Register
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
