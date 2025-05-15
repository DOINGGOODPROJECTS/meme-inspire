import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/lib/language-context"
import "./globals.css"

// Importer les messages
import enMessages from "@/messages/en.json"
import frMessages from "@/messages/fr.json"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "MEME-INSPIRE - Générateur de Mèmes Inspirants",
  description: "Créez, partagez et téléchargez des mèmes inspirants en quelques clics",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const messages = {
    en: enMessages,
    fr: frMessages,
  }

  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LanguageProvider messages={messages}>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
