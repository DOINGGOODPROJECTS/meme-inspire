"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-service"
import { useToast } from "@/hooks/use-toast"
import { useMemeStore } from "@/lib/meme-service"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth()
  const { memes } = useMemeStore()
  const { toast } = useToast()
  const [isUpdating, setIsUpdating] = useState(false)

  // Compter les mèmes de l'utilisateur
  const userMemeCount = isAuthenticated && user ? memes.filter((meme) => meme.userId === user.id).length : 0

  // Simuler la mise à jour du profil
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)

    // Simuler un délai réseau
    setTimeout(() => {
      setIsUpdating(false)
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès.",
      })
    }, 1000)
  }

  // Gérer la déconnexion
  const handleLogout = () => {
    logout()
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté avec succès.",
    })
    window.location.href = "/"
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Alert variant="destructive" className="max-w-md mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Accès refusé</AlertTitle>
            <AlertDescription>Vous devez être connecté pour accéder à cette page.</AlertDescription>
          </Alert>
          <div className="text-center mt-4">
            <Button onClick={() => (window.location.href = "/")}>Retour à l'accueil</Button>
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">Profil Utilisateur</h1>

          <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
            {/* Carte de profil */}
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto relative w-24 h-24 mb-2">
                  <Image
                    src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=default"}
                    alt="Avatar"
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <CardTitle>{user?.name}</CardTitle>
                <CardDescription>{user?.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Mèmes créés: {userMemeCount}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="destructive" className="w-full" onClick={handleLogout}>
                  Se déconnecter
                </Button>
              </CardFooter>
            </Card>

            {/* Formulaire de mise à jour */}
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>Mettez à jour vos informations personnelles ici.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom</Label>
                    <Input id="name" defaultValue={user?.name} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={user?.email} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Nouveau mot de passe</Label>
                    <Input id="password" type="password" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                    <Input id="confirm-password" type="password" />
                  </div>

                  <Button type="submit" className="w-full" disabled={isUpdating}>
                    {isUpdating ? "Mise à jour..." : "Mettre à jour le profil"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
