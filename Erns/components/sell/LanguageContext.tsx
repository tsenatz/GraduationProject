"use client";

import React, { createContext, useContext } from "react";
import { useLanguage, Language } from "@/components/providers/LanguageProvider";
import { translations } from "./translations";

interface SellLanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isAmharic: boolean;
  t: typeof translations.en;
}

const SellLanguageContext = createContext<SellLanguageContextType>({
  language: "en",
  setLanguage: () => {},
  toggleLanguage: () => {},
  isAmharic: false,
  t: translations.en,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { language, setLanguage, toggleLanguage, isAmharic } = useLanguage();

  const value: SellLanguageContextType = {
    language,
    setLanguage,
    toggleLanguage,
    isAmharic,
    t: translations[language],
  };

  return (
    <SellLanguageContext.Provider value={value}>
      {children}
    </SellLanguageContext.Provider>
  );
}

export function useSellLanguage() {
  const context = useContext(SellLanguageContext);
  if (!context) {
    throw new Error("useSellLanguage must be used within a LanguageProvider");
  }
  return context;
}
