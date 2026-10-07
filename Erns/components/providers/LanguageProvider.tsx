"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "am";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isAmharic: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  toggleLanguage: () => {},
  isAmharic: false,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  // Read saved language from localStorage and cookies on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("erns_lang") as Language | null;
      if (saved === "en" || saved === "am") {
        setLanguageState(saved);
        if (typeof document !== "undefined") {
          document.documentElement.lang = saved;
        }
      }
    } catch {
      // Ignore localStorage read errors in restricted environments
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "erns_lang" && (e.newValue === "en" || e.newValue === "am")) {
        setLanguageState(e.newValue);
        if (typeof document !== "undefined") {
          document.documentElement.lang = e.newValue;
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("erns_lang", lang);
      if (typeof document !== "undefined") {
        document.cookie = `erns_lang=${lang}; path=/; max-age=31536000; SameSite=Lax`;
        document.documentElement.lang = lang;
      }
    } catch {
      // Ignore write errors
    }
  };

  const toggleLanguage = () => {
    const nextLang = language === "en" ? "am" : "en";
    setLanguage(nextLang);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        isAmharic: language === "am",
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
