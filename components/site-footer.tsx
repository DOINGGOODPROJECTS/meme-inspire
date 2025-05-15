"use client"

import Link from "next/link"
import { useLanguage } from "@/lib/language-context"

export function SiteFooter() {
  const { t } = useLanguage()

  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          © {new Date().getFullYear()} {t("app.name")}
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="https://twitter.com"
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground"
          >
            Twitter
          </Link>
          <Link
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground"
          >
            Instagram
          </Link>
          <Link
            href="https://t.me"
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground"
          >
            Telegram
          </Link>
        </div>
      </div>
    </footer>
  )
}
