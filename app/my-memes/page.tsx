"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { useMemeStore, type Meme } from "@/lib/meme-service"
import { useAuth } from "@/lib/auth-service"
import { Share2, Download, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function MyMemesPage() {
  const { memes, deleteMeme } = useMemeStore()
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [userMemes, setUserMemes] = useState<Meme[]>([])
  const [memeToDelete, setMemeToDelete] = useState<string | null>(null)

  // Filtrer les mèmes de l'utilisateur
  useEffect(() => {
    if (isAuthenticated && user) {
      const filtered = memes.filter((meme) => meme.userId === user.id)
      setUserMemes(filtered)
    } else {
      setUserMemes([])
    }
  }, [memes, isAuthenticated, user])

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

  // Supprimer un mème
  const confirmDeleteMeme = (id: string) => {
    setMemeToDelete(id)
  }

  const handleDeleteMeme = () => {
    if (memeToDelete) {
      deleteMeme(memeToDelete)
      setMemeToDelete(null)

      toast({
        title: "Mème supprimé",
        description: "Le mème a été supprimé avec succès.",
      })
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <section className="max-w-5xl mx-auto text-center mb-10">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Mes Mèmes
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Gérez vos créations de mèmes inspirants.</p>
        </section>

        {/* Grille de mèmes */}
        {isAuthenticated ? (
          userMemes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userMemes.map((meme) => (
                <Card key={meme.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative aspect-[4/3] w-full">
                      <Image src={meme.imageUrl || "/placeholder.svg"} alt="Meme" fill className="object-cover" />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between p-4">
                    <div className="text-sm text-muted-foreground">
                      Créé le {new Date(meme.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => shareMeme(meme)}>
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => downloadMeme(meme)}>
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => confirmDeleteMeme(meme.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Vous n'avez pas encore créé de mèmes. Retournez à l'accueil pour en créer un !
              </p>
              <Button className="mt-4" asChild>
                <a href="/">Créer un mème</a>
              </Button>
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Vous devez être connecté pour voir vos mèmes.</p>
            <Button className="mt-4" onClick={() => (window.location.href = "/")}>
              Retour à l'accueil
            </Button>
          </div>
        )}
      </main>
      <SiteFooter />

      {/* Boîte de dialogue de confirmation de suppression */}
      <AlertDialog open={!!memeToDelete} onOpenChange={(open) => !open && setMemeToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Le mème sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMeme}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
