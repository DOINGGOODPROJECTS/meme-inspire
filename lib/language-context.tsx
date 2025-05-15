"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "en" | "fr"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, defaultValue?: string) => string
  messages: Record<string, any>
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

interface LanguageProviderProps {
  children: ReactNode
  initialLanguage?: Language
  messages: {
    en: Record<string, any>
    fr: Record<string, any>
  }
}

export function LanguageProvider({ children, initialLanguage = "fr", messages }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>(initialLanguage)

  // Charger la langue depuis localStorage au démarrage
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "fr")) {
      setLanguage(savedLanguage)
    } else {
      // Détecter la langue du navigateur
      const browserLanguage = navigator.language.split("-")[0]
      if (browserLanguage === "fr") {
        setLanguage("fr")
      } else {
        setLanguage("en")
      }
    }
  }, [])

  // Sauvegarder la langue dans localStorage quand elle change
  useEffect(() => {
    localStorage.setItem("language", language)
  }, [language])

  // Fonction pour obtenir une traduction
  const t = (key: string, defaultValue?: string): string => {
    const keys = key.split(".")
    let value = messages[language]

    for (const k of keys) {
      if (value === undefined) break
      value = value[k]
    }

    if (value === undefined || typeof value !== "string") {
      return defaultValue || key
    }

    return value
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, messages: messages[language] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
