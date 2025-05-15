"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { useMemeStore, type Meme } from "@/lib/meme-service"
import { useAuth } from "@/lib/auth-service"
import { Heart, Share2, Download, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function GalleryPage() {
  const { memes, likeMeme, unlikeMeme } = useMemeStore()
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredMemes, setFilteredMemes] = useState<Meme[]>([])

  // Filtrer les mèmes en fonction du terme de recherche
  useEffect(() => {
    const filtered = memes.filter(
      (meme) =>
        meme.topText.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meme.bottomText.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (meme.userName && meme.userName.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    setFilteredMemes(filtered)
  }, [memes, searchTerm])

  // Gérer le like d'un mème
  const handleLike = (id: string, isLiked: boolean | undefined) => {
    if (!isAuthenticated) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour aimer un mème.",
      })
      return
    }

    if (isLiked) {
      unlikeMeme(id)
    } else {
      likeMeme(id)
    }
  }

  // Télécharger un mème
  const downloadMeme = (meme: Meme) => {
    const link = document.createElement("a")
    link.href = meme.imageUrl
    link.download = `meme-inspire-${meme.id}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Téléchargement réussi",
      description: "Le mème a été téléchargé avec succès.",
    })
  }

  // Partager un mème
  const shareMeme = (meme: Meme) => {
    if (navigator.share) {
      navigator
        .share({
          title: "Mème inspirant",
          text: `${meme.topText} ${meme.bottomText}`.trim(),
          url: window.location.href,
        })
        .catch((error) => {
          console.error("Erreur lors du partage:", error)
        })
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Lien copié",
        description: "Le lien a été copié dans le presse-papiers.",
      })
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <section className="max-w-5xl mx-auto text-center mb-10">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Galerie de Mèmes
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez les mèmes inspirants créés par notre communauté.
          </p>
        </section>

        {/* Barre de recherche */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher des mèmes..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Grille de mèmes */}
        {filteredMemes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMemes.map((meme) => (
              <Card key={meme.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative aspect-[4/3] w-full">
                    <Image src={meme.imageUrl || "/placeholder.svg"} alt="Meme" fill className="object-cover" />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between p-4">
                  <div className="text-sm text-muted-foreground">
                    {meme.userName ? `Par ${meme.userName}` : "Anonyme"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleLike(meme.id, meme.userLiked)}>
                      <Heart className={`h-4 w-4 ${meme.userLiked ? "fill-red-500 text-red-500" : ""}`} />
                      <span className="ml-1">{meme.likes}</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => shareMeme(meme)}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => downloadMeme(meme)}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchTerm
                ? "Aucun mème ne correspond à votre recherche."
                : "Aucun mème n'a encore été créé. Soyez le premier à en ajouter un !"}
            </p>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
