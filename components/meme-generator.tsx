"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { RefreshCw, Download, Share2, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language-context"

export function MemeGenerator() {
  const { toast } = useToast()
  const { t, messages } = useLanguage()
  const [activeTab, setActiveTab] = useState("random")
  const [isLoading, setIsLoading] = useState(false)

  // Définir les filtres d'image avec des valeurs non vides
  const IMAGE_FILTERS = [
    { name: t("memeGenerator.filters.normal"), class: "none" }, // Changé de "" à "none"
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
    filter: "none", // Changé de "" à "none"
  })

  // Générer un mème aléatoire
  const generateRandomMeme = async () => {
    setIsLoading(true)

    try {
      // Obtenir une image aléatoire de Picsum
      const randomId = Math.floor(Math.random() * 1000)
      const imageUrl = `https://picsum.photos/id/${randomId}/800/600`

      // Sélectionner une citation aléatoire
      const quotes = messages.quotes || []
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]

      // Sélectionner un filtre aléatoire
      const randomFilter = IMAGE_FILTERS[Math.floor(Math.random() * IMAGE_FILTERS.length)]

      // Mettre à jour l'état
      setMeme({
        ...meme,
        backgroundImage: imageUrl,
        topText: randomQuote,
        bottomText: "",
        filter: randomFilter.class,
      })
    } catch (error) {
      console.error("Erreur lors de la génération du mème:", error)
      toast({
        title: "Erreur",
        description: "Impossible de générer un mème aléatoire.",
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

  // Télécharger le mème (version simplifiée)
  const downloadMeme = () => {
    toast({
      title: t("memeGenerator.actions.download"),
      description: t("memeGenerator.toast.downloadSuccess"),
    })
  }

  // Partager le mème (version simplifiée)
  const shareMeme = () => {
    toast({
      title: t("memeGenerator.actions.share"),
      description: t("memeGenerator.toast.shareSuccess"),
    })
  }

  // Sauvegarder le mème (version simplifiée)
  const saveMeme = () => {
    toast({
      title: t("memeGenerator.actions.save"),
      description: t("memeGenerator.toast.saveSuccess"),
    })
  }

  // Fonction pour appliquer le filtre à l'image
  const getFilterClass = (filterClass: string) => {
    return filterClass === "none" ? "" : filterClass
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* Panneau de prévisualisation */}
      <Card className="overflow-hidden">
        <CardContent className="p-0 relative">
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            {meme.backgroundImage ? (
              <>
                <Image
                  src={meme.backgroundImage || "/placeholder.svg"}
                  alt="Meme background"
                  fill
                  className={cn("object-cover", getFilterClass(meme.filter))}
                  priority
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
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {isLoading ? t("memeGenerator.random.generating") : t("memeGenerator.random.button")}
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
              <Button onClick={downloadMeme} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                {t("memeGenerator.actions.download")}
              </Button>
              <Button onClick={shareMeme} variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                {t("memeGenerator.actions.share")}
              </Button>
            </div>

            <Button onClick={saveMeme} className="w-full">
              <Save className="mr-2 h-4 w-4" />
              {t("memeGenerator.actions.save")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
