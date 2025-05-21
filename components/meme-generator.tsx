"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { RefreshCw, Download, Share2, Save, Twitter, Facebook, Send, Loader2, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language-context"
import { getRandomQuote, getLocalQuote } from "@/lib/quote-service"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

export function MemeGenerator() {
  const { toast } = useToast()
  const { t, language, messages } = useLanguage()
  const [activeTab, setActiveTab] = useState("random")
  const [isLoading, setIsLoading] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const memeRef = useRef<HTMLDivElement>(null)
  const [apiError, setApiError] = useState(false)

  const sendToDiscordServer = async (buffer: Buffer, topText: string, author?: string) => {
    const base64 = Buffer.from(buffer).toString("base64");
    const res = await fetch("/api/send-meme", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        buffer: base64,
        topText: topText,
        author: author,
      }),
    });

    if (!res.ok) throw new Error("Échec de l’envoi au serveur Discord");
  };

  // Définir les filtres d'image avec des valeurs non vides
  const IMAGE_FILTERS = [
    { name: t("memeGenerator.filters.normal"), class: "none" },
    { name: t("memeGenerator.filters.grayscale"), class: "grayscale" },
    { name: t("memeGenerator.filters.sepia"), class: "sepia" },
    { name: t("memeGenerator.filters.contrast"), class: "contrast-125" },
    { name: t("memeGenerator.filters.bright"), class: "brightness-125" },
  ]

  const [meme, setMeme] = useState({
    backgroundImage: "",
    topText: "",
    bottomText: "",
    fontSize: 40,
    textColor: "#ffffff",
    textShadow: true,
    filter: "none",
    author: "",
  })

  // Générer un mème aléatoire
  const generateRandomMeme = async () => {
    setIsLoading(true)

    try {
      // Obtenir une image aléatoire de Picsum
      const randomId = Math.floor(Math.random() * 1000)
      const imageUrl = `https://picsum.photos/id/${randomId}/800/600`

      // Obtenir une citation
      let quoteText = ""
      let authorText = ""

      // Si l'API a échoué précédemment, utiliser directement les citations locales
      if (!apiError) {
        try {
          const quote = await getRandomQuote()
          if (quote) {
            quoteText = quote.content
            authorText = quote.author
          } else {
            // Si l'API renvoie null, utiliser les citations locales
            const localQuotes = messages.quotes || []
            const localQuote = getLocalQuote(localQuotes)
            quoteText = localQuote.content
            authorText = localQuote.author
          }
        } catch (error) {
          console.error("Erreur lors de la récupération de la citation:", error)
          setApiError(true) // Marquer l'API comme défaillante

          // Utiliser les citations locales
          const localQuotes = messages.quotes || []
          const localQuote = getLocalQuote(localQuotes)
          quoteText = localQuote.content
          authorText = localQuote.author
        }
      } else {
        // Utiliser directement les citations locales si l'API a déjà échoué
        const localQuotes = messages.quotes || []
        const localQuote = getLocalQuote(localQuotes)
        quoteText = localQuote.content
        authorText = localQuote.author
      }

      // Sélectionner un filtre aléatoire
      const randomFilter = IMAGE_FILTERS[Math.floor(Math.random() * IMAGE_FILTERS.length)]

      // Mettre à jour l'état
      setMeme({
        ...meme,
        backgroundImage: imageUrl,
        topText: quoteText,
        bottomText: "",
        filter: randomFilter.class,
        author: authorText,
      })

      const imageBuffer = await generateMemeImage();
      await sendToDiscordServer(imageBuffer, quoteText || "Inspiration du jour 💡", authorText || "Anonyme");
    } catch (error) {
      console.error("Erreur lors de la génération du mème:", error)
      toast({
        title: "Erreur",
        description: "Impossible de générer un mème aléatoire. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Générer le mème au chargement initial
  useEffect(() => {
    if (activeTab === "random") {
      generateRandomMeme()
    }
  }, [activeTab])

  // Fonction pour générer une image du mème
  const generateMemeImage = async (): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
      if (!memeRef.current) {
        reject("Élément mème non trouvé")
        return
      }

      const canvas = canvasRef.current
      if (!canvas) {
        reject("Canvas non trouvé")
        return
      }

      // Définir les dimensions du canvas
      const memeElement = memeRef.current
      const width = memeElement.offsetWidth
      const height = memeElement.offsetHeight

      canvas.width = width
      canvas.height = height

      // Utiliser html2canvas pour capturer le mème
      import("html2canvas")
        .then((html2canvas) => {
          html2canvas
            .default(memeElement, {
              allowTaint: true,
              useCORS: true,
              scale: 2, // Meilleure qualité
            })
            .then((canvas) => {
              // const dataUrl = canvas.toDataURL("image/png")
              // resolve(dataUrl)

              canvas.toBlob(blob => {
                if (!blob) {
                  reject("Erreur de conversion en Blob");
                  return;
                }
                const reader = new FileReader();
                reader.onloadend = () => {
                  const buffer = Buffer.from(reader.result as ArrayBuffer);
                  resolve(buffer);
                };
                reader.readAsArrayBuffer(blob);
              }, 'image/png');
            })
            .catch((error) => {
              console.error("Erreur lors de la génération de l'image:", error)
              reject(error)
            })
        })
        .catch((error) => {
          console.error("Erreur lors du chargement de html2canvas:", error)
          reject(error)
        })
    })
  }

  // Télécharger le mème
  const downloadMeme = async () => {
    try {
      setIsLoading(true);
      
      // Générer l'image du mème
      const imageBuffer = await generateMemeImage();
      
      // Convertir le Buffer en URL pour le téléchargement
      const blob = new Blob([imageBuffer], { type: 'image/png' });
      const dataUrl = URL.createObjectURL(blob);
      
      // Téléchargement local
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `meme-inspire-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Libérer la mémoire
      setTimeout(() => URL.revokeObjectURL(dataUrl), 100);     
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le mème. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Ouvrir la boîte de dialogue de partage
  const openShareDialog = () => {
    setShareDialogOpen(true)
  }

  // Partager sur les réseaux sociaux
  const shareMeme = async (platform: string) => {
    try {
      setIsLoading(true)
      const dataUrl = await generateMemeImage()

      // Texte à partager
      const shareText = `${meme.topText} ${meme.author ? `- ${meme.author}` : ""}`

      // Essayer d'abord l'API Web Share si disponible
      if (navigator.share && platform === "native") {
        try {
          await navigator.share({
            title: "MEME-INSPIRE",
            text: shareText,
            // Note: Web Share API ne permet pas de partager des images directement via dataURL
            // Vous auriez besoin d'un serveur pour héberger l'image temporairement
          })

          setShareDialogOpen(false)
          toast({
            title: t("memeGenerator.actions.share"),
            description: t("memeGenerator.toast.shareSuccess"),
          })
          return
        } catch (error) {
          console.error("Erreur lors du partage natif:", error)
          // Continuer avec les méthodes alternatives
        }
      }

      // Méthodes spécifiques à chaque plateforme
      switch (platform) {
        case "twitter":
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&hashtags=MemeInspire`,
            "_blank",
          )
          break
        case "facebook":
          // Note: Facebook nécessite une URL pour partager, pas juste du texte
          // Dans une application réelle, vous auriez besoin d'un serveur pour héberger l'image
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(shareText)}`,
            "_blank",
          )
          break
        case "telegram":
          window.open(
            `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(shareText)}`,
            "_blank",
          )
          break
        default:
          // Copier le texte dans le presse-papiers
          await navigator.clipboard.writeText(shareText)
          toast({
            title: "Texte copié",
            description: "Le texte du mème a été copié dans le presse-papiers.",
          })
      }

      setShareDialogOpen(false)
    } catch (error) {
      console.error("Erreur lors du partage:", error)
      toast({
        title: "Erreur",
        description: "Impossible de partager le mème. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Fonction pour appliquer le filtre à l'image
  const getFilterClass = (filterClass: string) => {
    return filterClass === "none" ? "" : filterClass
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* Canvas caché pour la génération d'images */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Panneau de prévisualisation */}
      <Card className="overflow-hidden">
        <CardContent className="p-0 relative">
          <div ref={memeRef} className="relative aspect-[4/3] w-full overflow-hidden">
            {meme.backgroundImage ? (
              <>
                <Image
                  src={meme.backgroundImage || "/placeholder.svg"}
                  alt="Meme background"
                  fill
                  className={cn("object-cover", getFilterClass(meme.filter))}
                  priority
                  crossOrigin="anonymous"
                />
                <div className="absolute inset-0 flex flex-col justify-between p-4 text-center">
                  <h2
                    className={cn("font-bold break-words px-2 py-1", meme.textShadow ? "text-shadow-lg" : "")}
                    style={{
                      fontSize: `${meme.fontSize}px`,
                      color: meme.textColor,
                    }}
                  >
                    {meme.topText}
                  </h2>
                  {meme.author && (
                    <p
                      className={cn("font-medium break-words px-2 py-1", meme.textShadow ? "text-shadow-lg" : "")}
                      style={{
                        fontSize: `${Math.max(16, meme.fontSize / 2)}px`,
                        color: meme.textColor,
                      }}
                    >
                      - {meme.author}
                    </p>
                  )}
                  <h2
                    className={cn("font-bold break-words px-2 py-1", meme.textShadow ? "text-shadow-lg" : "")}
                    style={{
                      fontSize: `${meme.fontSize}px`,
                      color: meme.textColor,
                    }}
                  >
                    {meme.bottomText}
                  </h2>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full bg-muted">
                <p>Chargement de l'image...</p>
              </div>
            )}
          </div>
          <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full p-2">
            <Button variant="ghost" size="icon" onClick={generateRandomMeme} disabled={isLoading}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Panneau de contrôle */}
      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="random" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="random">{t("memeGenerator.tabs.random")}</TabsTrigger>
              <TabsTrigger value="custom">{t("memeGenerator.tabs.custom")}</TabsTrigger>
            </TabsList>

            <TabsContent value="random" className="space-y-6">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">{t("memeGenerator.random.description")}</p>
                <Button onClick={generateRandomMeme} className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("memeGenerator.random.generating")}
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      {t("memeGenerator.random.button")}
                    </>
                  )}
                </Button>
              </div>

              <div className="space-y-4 mt-4">
                <Label>{t("memeGenerator.custom.filter")}</Label>
                <Select value={meme.filter} onValueChange={(value) => setMeme({ ...meme, filter: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("memeGenerator.custom.filter")} />
                  </SelectTrigger>
                  <SelectContent>
                    {IMAGE_FILTERS.map((filter) => (
                      <SelectItem key={filter.name} value={filter.class}>
                        {filter.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {apiError && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md text-amber-800 dark:text-amber-200 text-sm">
                  <p>Les citations sont actuellement générées localement car l'API externe n'est pas disponible.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="custom" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="top-text">{t("memeGenerator.custom.topText")}</Label>
                  <Input
                    id="top-text"
                    value={meme.topText}
                    onChange={(e) => setMeme({ ...meme, topText: e.target.value })}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="author">Auteur</Label>
                  <Input
                    id="author"
                    value={meme.author}
                    onChange={(e) => setMeme({ ...meme, author: e.target.value })}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="bottom-text">{t("memeGenerator.custom.bottomText")}</Label>
                  <Input
                    id="bottom-text"
                    value={meme.bottomText}
                    onChange={(e) => setMeme({ ...meme, bottomText: e.target.value })}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <div className="flex justify-between">
                    <Label htmlFor="font-size">
                      {t("memeGenerator.custom.fontSize")}: {meme.fontSize}px
                    </Label>
                  </div>
                  <Slider
                    id="font-size"
                    min={20}
                    max={80}
                    step={1}
                    value={[meme.fontSize]}
                    onValueChange={(value) => setMeme({ ...meme, fontSize: value[0] })}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="text-color">{t("memeGenerator.custom.textColor")}</Label>
                  <div className="flex items-center gap-2 mt-1.5">
                    <input
                      type="color"
                      id="text-color"
                      value={meme.textColor}
                      onChange={(e) => setMeme({ ...meme, textColor: e.target.value })}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <Input value={meme.textColor} onChange={(e) => setMeme({ ...meme, textColor: e.target.value })} />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="text-shadow"
                    checked={meme.textShadow}
                    onCheckedChange={(checked) => setMeme({ ...meme, textShadow: checked })}
                  />
                  <Label htmlFor="text-shadow">{t("memeGenerator.custom.textShadow")}</Label>
                </div>

                <div className="space-y-4 mt-4">
                  <Label>{t("memeGenerator.custom.filter")}</Label>
                  <Select value={meme.filter} onValueChange={(value) => setMeme({ ...meme, filter: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("memeGenerator.custom.filter")} />
                    </SelectTrigger>
                    <SelectContent>
                      {IMAGE_FILTERS.map((filter) => (
                        <SelectItem key={filter.name} value={filter.class}>
                          {filter.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="mt-8 space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={downloadMeme} variant="outline" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                {t("memeGenerator.actions.download")}
              </Button>
              <Button onClick={openShareDialog} variant="outline" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Share2 className="mr-2 h-4 w-4" />}
                {t("memeGenerator.actions.share")}
              </Button>
            </div>

            <Button
              onClick={() =>
                toast({ title: t("memeGenerator.actions.save"), description: t("memeGenerator.toast.saveSuccess") })
              }
              className="w-full"
            >
              <Save className="mr-2 h-4 w-4" />
              {t("memeGenerator.actions.save")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Boîte de dialogue de partage */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("memeGenerator.share.title", "Partager votre mème")}</DialogTitle>
            <DialogDescription>
              {t("memeGenerator.share.description", "Choisissez une plateforme pour partager votre création.")}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-3 gap-4 py-4">
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-24"
              onClick={() => shareMeme("twitter")}
              disabled={isLoading}
            >
              <Twitter className="h-8 w-8 mb-2" />
              <span>Twitter</span>
            </Button>

            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-24"
              onClick={() => shareMeme("facebook")}
              disabled={isLoading}
            >
              <Facebook className="h-8 w-8 mb-2" />
              <span>Facebook</span>
            </Button>

            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-24"
              onClick={() => shareMeme("telegram")}
              disabled={isLoading}
            >
              <Send className="h-8 w-8 mb-2" />
              <span>Telegram</span>
            </Button>
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setShareDialogOpen(false)}>
              <X className="mr-2 h-4 w-4" />
              {t("common.cancel", "Annuler")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
