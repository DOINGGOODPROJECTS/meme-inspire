// Service pour le partage sur les réseaux sociaux

export interface ShareOptions {
  title: string
  text: string
  url: string
  hashtags?: string[]
}

// Partage via l'API Web Share si disponible
export async function shareViaWebAPI(options: ShareOptions): Promise<boolean> {
  if (navigator.share) {
    try {
      await navigator.share({
        title: options.title,
        text: options.text,
        url: options.url,
      })
      return true
    } catch (error) {
      console.error("Erreur lors du partage:", error)
      return false
    }
  }
  return false
}

// Partage sur Twitter
export function shareOnTwitter(options: ShareOptions): void {
  const hashtags = options.hashtags?.join(",") || "memeinspire"
  const text = encodeURIComponent(options.text)
  const url = encodeURIComponent(options.url)

  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=${hashtags}`, "_blank")
}

// Partage sur Telegram
export function shareOnTelegram(options: ShareOptions): void {
  const text = encodeURIComponent(`${options.text} ${options.url}`)

  window.open(
    `https://t.me/share/url?url=${encodeURIComponent(options.url)}&text=${encodeURIComponent(options.text)}`,
    "_blank",
  )
}

// Partage sur Facebook
export function shareOnFacebook(options: ShareOptions): void {
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(options.url)}`, "_blank")
}

// Partage sur WhatsApp
export function shareOnWhatsApp(options: ShareOptions): void {
  const text = encodeURIComponent(`${options.text} ${options.url}`)

  window.open(`https://wa.me/?text=${text}`, "_blank")
}

// Partage par email
export function shareByEmail(options: ShareOptions): void {
  const subject = encodeURIComponent(options.title)
  const body = encodeURIComponent(`${options.text}\n\n${options.url}`)

  window.open(`mailto:?subject=${subject}&body=${body}`, "_blank")
}
