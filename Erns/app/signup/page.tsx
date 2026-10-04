"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Home, ChevronDown } from "lucide-react";
import { GoogleIcon, AppleIcon, FacebookIcon } from "@/components/icons/SocialIcons";
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
        <div className={styles.topTabs}>
          <Link href="/login" className={styles.tab}>
            Sign In
          </Link>
          <Link href="/signup" className={`${styles.tab} ${styles.activeTab}`}>
            Sign Up
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
