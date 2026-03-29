"use client"

import { AppShell } from "@/components/layout/app-shell"
import { PageHeader } from "@/components/layout/page-header"
import { useEffect } from "react"
import { useStore } from "@/lib/store"

export default function FrenchResourcesPage() {
  const { setLanguageAndRegion } = useStore()

  useEffect(() => {
    // Set language context (use a default region or keep unspecified)
    setLanguageAndRegion("french", "france")
  }, [setLanguageAndRegion])

  return (
    <AppShell showBackButton backHref="/learn/language">
      <div className="max-w-[1200px] mx-auto px-6 py-8 md:px-12 pb-32">
        <PageHeader
          title="French Resources"
          subtitle="Music, films, and podcasts from France, Quebec, and beyond"
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
                <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground hover:translate-x-2 transition-all">• La Tête au Carré</li>
                <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground hover:translate-x-2 transition-all">• Affaires Sensibles</li>
                <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground hover:translate-x-2 transition-all">• Transfert</li>
                <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground hover:translate-x-2 transition-all">• La Poudre</li>
                <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground hover:translate-x-2 transition-all">• Sur le grill</li>
                <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground hover:translate-x-2 transition-all">• Choses à Savoir</li>
                <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground hover:translate-x-2 transition-all">• La soirée est (encore) jeune</li>
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
                <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground hover:translate-x-2 transition-all">• La Vie en Rose</li>
                <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground hover:translate-x-2 transition-all">• Ne Me Quitte Pas</li>
                <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground hover:translate-x-2 transition-all">• Je te promets</li>
                <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground hover:translate-x-2 transition-all">• Aux Champs-Élysées</li>
                <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground hover:translate-x-2 transition-all">• Alors on danse</li>
                <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground hover:translate-x-2 transition-all">• Balance ton quoi</li>
                <li className="text-base leading-relaxed text-foreground/90 hover:text-foreground hover:translate-x-2 transition-all">• Gens du pays</li>
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
    </AppShell>
  )
}
