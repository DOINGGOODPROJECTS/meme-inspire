// Service pour l'API Quotable
export interface Quote {
  _id: string
  content: string
  author: string
  tags: string[]
  length: number
}

/**
 * Récupère une citation aléatoire depuis l'API Quotable avec un timeout
 */
export async function getRandomQuote(lang = "en"): Promise<Quote | null> {
  // Créer un contrôleur d'abandon pour le timeout
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 secondes de timeout

  try {
    const response = await fetch("https://api.quotable.io/random", {
      signal: controller.signal,
      // Ajouter des en-têtes pour éviter les problèmes de CORS
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    clearTimeout(timeoutId) // Annuler le timeout si la requête réussit

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    clearTimeout(timeoutId) // Annuler le timeout en cas d'erreur

    // Journaliser l'erreur mais ne pas la propager
    console.warn("Impossible de récupérer une citation depuis l'API:", error)
    return null
  }
}

/**
 * Génère une citation locale aléatoire
 */
export function getLocalQuote(quotes: string[]): Quote {
  const randomIndex = Math.floor(Math.random() * quotes.length)
  const content = quotes[randomIndex] || "La vie est belle"

  return {
    _id: `local-${randomIndex}`,
    content,
    author: "MEME-INSPIRE",
    tags: ["inspiration"],
    length: content.length,
  }
}
