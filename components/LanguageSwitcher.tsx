"use client";

import React from "react";
import { Languages } from "lucide-react";
import { Locale } from "@/constants/content";

interface LanguageSwitcherProps {
  currentLocale: Locale;
  onLocaleChange: (locale: Locale) => void;
  className?: string;
}

export function LanguageSwitcher({ currentLocale, onLocaleChange, className = "" }: LanguageSwitcherProps) {
  const languages = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिंदी" },
    { code: "mr", label: "मराठी" },
  ];

  return (
    <div className={`flex items-center gap-2 p-1 bg-slate-100 rounded-full border border-slate-200 ${className}`}>
      <div className="p-2 text-slate-400">
        <Languages className="w-4 h-4" />
      </div>
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => onLocaleChange(lang.code as Locale)}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
            currentLocale === lang.code 
              ? "bg-white text-blue-600 shadow-sm" 
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
