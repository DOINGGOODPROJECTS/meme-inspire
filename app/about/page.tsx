import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8 text-center">
            À propos de MEME-INSPIRE
          </h1>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>
              MEME-INSPIRE est une plateforme de création et de partage de mèmes inspirants. Notre mission est de
              répandre la positivité et l'inspiration à travers des images accompagnées de citations motivantes.
            </p>

            <h2>Fonctionnalités</h2>
            <ul>
              <li>
                <strong>Génération aléatoire</strong> - Créez instantanément des mèmes inspirants avec notre générateur
                aléatoire qui combine des images de haute qualité et des citations motivantes.
              </li>
              <li>
                <strong>Personnalisation complète</strong> - Choisissez vos propres images, textes, couleurs et styles
                pour créer des mèmes uniques qui vous ressemblent.
              </li>
              <li>
                <strong>Filtres d'image</strong> - Appliquez différents filtres à vos images pour créer l'ambiance
                parfaite pour votre message inspirant.
              </li>
              <li>
                <strong>Partage facile</strong> - Partagez vos créations directement sur les réseaux sociaux comme
                Twitter, Facebook et Telegram.
              </li>
              <li>
                <strong>Galerie communautaire</strong> - Découvrez les mèmes créés par d'autres utilisateurs et
                inspirez-vous de leurs créations.
              </li>
            </ul>

            <h2>Technologies utilisées</h2>
            <ul>
              <li>Next.js - Framework React pour le développement web</li>
              <li>Tailwind CSS - Pour un design responsive et élégant</li>
              <li>Picsum Photos API - Pour des images de haute qualité</li>
              <li>Zustand - Pour la gestion de l'état de l'application</li>
              <li>Canvas API - Pour la génération d'images</li>
            </ul>

            <h2>Confidentialité</h2>
            <p>
              Chez MEME-INSPIRE, nous respectons votre vie privée. Nous ne collectons que les informations nécessaires
              pour vous fournir nos services. Vos créations vous appartiennent et vous pouvez les supprimer à tout
              moment.
            </p>

            <h2>Contactez-nous</h2>
            <p>
              Vous avez des questions, des suggestions ou des commentaires ? N'hésitez pas à nous contacter à l'adresse
              contact@meme-inspire.com.
            </p>
          </div>

          <div className="mt-8 text-center">
            <Button asChild>
              <Link href="/">Commencer à créer</Link>
            </Button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
