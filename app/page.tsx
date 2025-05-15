"use client"

import { MemeGenerator } from "@/components/meme-generator"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { useLanguage } from "@/lib/language-context"

export default function Home() {
  const { t } = useLanguage()

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <section className="max-w-5xl mx-auto text-center mb-10">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            {t("app.name")}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("app.description")}</p>
        </section>

        <MemeGenerator />
      </main>
      <SiteFooter />
    </div>
  )
}
