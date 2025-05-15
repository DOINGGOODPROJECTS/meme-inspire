// Service pour l'API Picsum Photos
export interface PicsumImage {
  id: string
  author: string
  width: number
  height: number
  url: string
  download_url: string
}

export interface ImageFilter {
  name: string
  class: string
}

// Liste des filtres disponibles
export const imageFilters: ImageFilter[] = [
  { name: "Normal", class: "" },
  { name: "Noir et blanc", class: "grayscale" },
  { name: "Sépia", class: "sepia" },
  { name: "Contraste", class: "contrast-125" },
  { name: "Lumineux", class: "brightness-125" },
  { name: "Sombre", class: "brightness-75" },
  { name: "Flou", class: "blur-sm" },
  { name: "Saturé", class: "saturate-150" },
  { name: "Désaturé", class: "saturate-50" },
  { name: "Hue-rotate", class: "hue-rotate-60" },
]

// Récupérer une liste d'images depuis l'API Picsum
export async function getPicsumImages(page = 1, limit = 30): Promise<PicsumImage[]> {
  try {
    const response = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=${limit}`)
    if (!response.ok) throw new Error("Erreur lors de la récupération des images")
    return await response.json()
  } catch (error) {
    console.error("Erreur:", error)
    return []
  }
}

// Récupérer une image aléatoire
export function getRandomPicsumUrl(width = 800, height = 600, id?: string): string {
  if (id) {
    return `https://picsum.photos/id/${id}/${width}/${height}`
  }
  return `https://picsum.photos/${width}/${height}?random=${Math.random()}`
}

// Récupérer une image spécifique par ID
export function getPicsumUrlById(id: string, width = 800, height = 600): string {
  return `https://picsum.photos/id/${id}/${width}/${height}`
}
