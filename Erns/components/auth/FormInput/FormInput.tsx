"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import styles from "./FormInput.module.css";

type InputType = "text" | "email" | "password" | "tel";

interface FormInputProps {
  id: string;
  name?: string;
  label: string;
  type?: InputType;
  placeholder?: string;
  value?: string;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Extra CSS class applied to the outer inputGroup div */
  className?: string;
}

/**
 * Labeled form input with optional password-visibility toggle.
 * Password inputs automatically get an eye icon to show/hide the value.
 */
export function FormInput({
  id,
  name,
  label,
  type = "text",
  placeholder,
  value,
  required,
  onChange,
  className = "",
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className={`${styles.inputGroup} ${className}`}>
      <label htmlFor={id}>{label}</label>
      <div className={styles.inputWrapper}>
        <input
          type={resolvedType}
          id={id}
          name={name ?? id}
          value={value}
          onChange={onChange}
          className={styles.input}
          placeholder={placeholder}
          required={required}
        />
        {isPassword &&
          (showPassword ? (
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
          ))}
      </div>
    </div>
  );
}
