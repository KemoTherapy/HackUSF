"use client"

import { useEffect } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { useStore } from "@/lib/store"
import { REGIONS } from "@/lib/constants"

export function ClientRegionResources({ region }: { region: typeof REGIONS[number] }) {
  const { setLanguageAndRegion } = useStore()

  useEffect(() => {
    if (region) setLanguageAndRegion(region.language, region.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [region])

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8 md:px-12 pb-32">
      <PageHeader
        title={`${region.name} Resources`}
        subtitle={`Curated resources for ${region.name} (${region.language})`}
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
              <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground transition-all">
                <a
                  href="https://podcasts.apple.com/si/podcast/turismo-me-dico-en-me-xico-experiencias-y-costos-medical/id1510277822?i=1000620749590"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  Spanish and Go — Turismo Médico en México
                </a>
                <span className="block text-sm text-muted mt-0.5">Medical tourism in Mexico: experiences and costs — 37 min episode</span>
              </li>
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
              <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground hover:translate-x-2 transition-all">• Todos Me Miran</li>
              <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground hover:translate-x-2 transition-all">• La Bamba</li>
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
              <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground hover:translate-x-2 transition-all">• La perla</li>
              <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground hover:translate-x-2 transition-all">• María Candelaria</li>
              <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground hover:translate-x-2 transition-all">• Amores Perros</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
