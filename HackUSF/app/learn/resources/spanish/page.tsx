"use client"

import { AppShell } from "@/components/layout/app-shell"
import { PageHeader } from "@/components/layout/page-header"
import { useEffect } from "react"
import { useStore } from "@/lib/store"

export default function SpanishResourcesPage() {
  const { setLanguageAndRegion } = useStore()

  useEffect(() => {
    // Set language context (use a default region or keep unspecified)
    setLanguageAndRegion("spanish", "mexico")
  }, [setLanguageAndRegion])

  return (
    <AppShell showBackButton backHref="/learn/language">
      <div className="max-w-[1200px] mx-auto px-6 py-8 md:px-12 pb-32">
        <PageHeader
          title="Spanish Resources"
          subtitle="Learn Spanish with curated media from all Spanish-speaking regions"
        />

        <div className="mb-8 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        <div className="grid md:grid-cols-3 gap-8">
          <div className="group relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-card to-card/95 p-12 transition-all hover:shadow-lg hover:border-primary/50 min-h-[600px]">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative">
              <h3 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <span className="text-4xl">🎙️</span>
                <span>Podcasts</span>
              </h3>
              <div className="mb-8 h-1 w-16 bg-gradient-to-r from-primary to-primary/50 rounded-full" />
              <ul className="space-y-4">
                <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground hover:translate-x-2 transition-all">• Leyendas Legendarias</li>
                <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground hover:translate-x-2 transition-all">• Podcast Mundo Futuro</li>
                <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground hover:translate-x-2 transition-all">• Se Regalan Dudas</li>
                <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground hover:translate-x-2 transition-all">• La Cotorrisa</li>
                <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground hover:translate-x-2 transition-all">• Nada que ver</li>
                <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground hover:translate-x-2 transition-all">• Radio Ambulante</li>
                <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground hover:translate-x-2 transition-all">• Nadie Sabe Nada</li>
              </ul>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-card to-card/95 p-12 transition-all hover:shadow-lg hover:border-primary/50 min-h-[600px]">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative">
              <h3 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <span className="text-4xl">🎵</span>
                <span>Songs</span>
              </h3>
              <div className="mb-8 h-1 w-16 bg-gradient-to-r from-primary to-primary/50 rounded-full" />
              <ul className="space-y-4">
                <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground hover:translate-x-2 transition-all">• Cielito Lindo</li>
                <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground hover:translate-x-2 transition-all">• El Rey</li>
                <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground hover:translate-x-2 transition-all">• Sabor a Mí</li>
                <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground hover:translate-x-2 transition-all">• Despacito</li>
                <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground hover:translate-x-2 transition-all">• Bailando</li>
                <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground hover:translate-x-2 transition-all">• La Camisa Negra</li>
                <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground hover:translate-x-2 transition-all">• Obsesión</li>
              </ul>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-card to-card/95 p-12 transition-all hover:shadow-lg hover:border-primary/50 min-h-[600px]">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative">
              <h3 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <span className="text-4xl">🎬</span>
                <span>Movies</span>
              </h3>
              <div className="mb-8 h-1 w-16 bg-gradient-to-r from-primary to-primary/50 rounded-full" />
              <ul className="space-y-4">
                <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground hover:translate-x-2 transition-all">• Y tu mamá también</li>
                <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground hover:translate-x-2 transition-all">• El laberinto del fauno</li>
                <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground hover:translate-x-2 transition-all">• Amores Perros</li>
                <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground hover:translate-x-2 transition-all">• All About My Mother</li>
                <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground hover:translate-x-2 transition-all">• Talk to Her</li>
                <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground hover:translate-x-2 transition-all">• La vendedora de rosas</li>
                <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground hover:translate-x-2 transition-all">• Machuca</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
