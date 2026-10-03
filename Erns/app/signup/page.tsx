"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Home, ChevronDown } from "lucide-react";
import styles from "./signup.module.css";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "buyer"
  });

  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselItems = [
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle backend registration logic here
    console.log("Signup form submitted: ", formData);
  };

  return (
    <main className={styles.container}>
      {/* Left Image Section */}
      <section className={styles.imageSection}>
        <div className={styles.imageWrapper}>
          <Image
            src="/signup.png"
            alt="Modern Architecture Home"
            fill
            priority
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className={styles.imageOverlay} />

        <div className={styles.logoArea}>
          <div className={styles.logoIcon}>
            <Home size={20} strokeWidth={2.5} />
          </div>
          <span className={styles.logoText}>ERNS</span>
        </div>

        <div className={styles.imageContent}>
          <div className={styles.textContent} key={currentSlide}>
            <h1>{carouselItems[currentSlide].title}</h1>
            <p>{carouselItems[currentSlide].desc}</p>
          </div>
          <div className={styles.dots}>
            {carouselItems.map((_, index) => (
              <div
                key={index}
                className={`${styles.dot} ${currentSlide === index ? styles.active : ""}`}
                onClick={() => setCurrentSlide(index)}
                style={{ cursor: "pointer" }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Right Form Section */}
      <section className={styles.formSection}>
        <div className={styles.signInTopRight}>
          <Link href="/login">
            <button type="button">Sign In</button>
          </Link>
        </div>

        <div className={styles.formWrapper}>
          <div className={styles.formHeader}>
            <h2>Join ERNS Today!</h2>
            <p>Create your account to get started</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label htmlFor="firstName">First Name</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="John"
                    required
                  />
                </div>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="lastName">Last Name</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email">Your Email</label>
              <div className={styles.inputWrapper}>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="john.doe@example.com"
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="role">I am a...</label>
              <div className={styles.inputWrapper}>
                <select 
                  id="role" 
                  name="role" 
                  value={formData.role}
                  onChange={handleChange}
                  className={styles.select}
                  required
                >
                  <option value="buyer">Prospective Buyer</option>
                  <option value="leaser">Prospective Tenant (Leaser)</option>
                  <option value="agent">Real Estate Agent</option>
                  <option value="property_manager">Property Manager</option>
                  <option value="individual_seller">Private Seller</option>
                </select>
                <ChevronDown size={20} className={styles.chevronIcon} />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label htmlFor="password">Create Password</label>
                <div className={styles.inputWrapper}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="••••••••"
                    required
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

              <div className={styles.inputGroup}>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className={styles.inputWrapper}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="••••••••"
                    required
                  />
                  {showConfirmPassword ? (
                    <EyeOff
                      size={20}
                      className={styles.eyeIcon}
                      onClick={() => setShowConfirmPassword(false)}
                    />
                  ) : (
                    <Eye
                      size={20}
                      className={styles.eyeIcon}
                      onClick={() => setShowConfirmPassword(true)}
                    />
                  )}
                </div>
              </div>
            </div>

            <button type="submit" className={styles.loginBtn}>
              Create Account
            </button>
          </form>

          <div className={styles.divider}>
            <span>Or Sign Up With</span>
          </div>

          <div className={styles.socialLogin}>
            <button type="button" className={styles.socialBtn}>
              <svg className={styles.socialIcon} viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                <path d="M1 1h22v22H1z" fill="none"/>
              </svg>
            </button>
            <button type="button" className={styles.socialBtn}>
              <svg className={styles.socialIcon} viewBox="0 0 384 512">
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" fill="#000000"/>
              </svg>
            </button>
            <button type="button" className={styles.socialBtn}>
              <svg className={styles.socialIcon} viewBox="0 0 24 24">
                <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z" fill="#1877F2"/>
              </svg>
            </button>
          </div>

          <div className={styles.registerText}>
            Already have an account? 
            <Link href="/login" className={styles.registerLink}>
              Log in
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
