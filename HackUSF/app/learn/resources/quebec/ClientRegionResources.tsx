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
              <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground hover:translate-x-2 transition-all">• La soirée est (encore) jeune</li>
              <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground hover:translate-x-2 transition-all">• Les coureurs des bois</li>
              <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground hover:translate-x-2 transition-all">• 2 filles le matin</li>
              <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground hover:translate-x-2 transition-all">• La revanche des nerdz</li>
              <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground hover:translate-x-2 transition-all">• BLVD</li>
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
              <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground hover:translate-x-2 transition-all">• Gens du pays</li>
              <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground hover:translate-x-2 transition-all">• Comme des enfants</li>
              <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground hover:translate-x-2 transition-all">• La rue principale</li>
              <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground hover:translate-x-2 transition-all">• Bye bye</li>
              <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground hover:translate-x-2 transition-all">• Tout oublier</li>
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
              <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground hover:translate-x-2 transition-all">• Incendies</li>
              <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground hover:translate-x-2 transition-all">• C.R.A.Z.Y.</li>
              <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground hover:translate-x-2 transition-all">• La Grande Séduction</li>
              <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground hover:translate-x-2 transition-all">• Bon Cop Bad Cop</li>
              <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground hover:translate-x-2 transition-all">• Mommy</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
