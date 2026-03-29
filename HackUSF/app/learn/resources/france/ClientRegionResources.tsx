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
        title="France Resources"
        subtitle="Curated French resources for healthcare vocabulary, film, music, and podcasts"
      />

      <div className="mb-8 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="grid md:grid-cols-2 gap-8">

        {/* Vocabulary */}
        <div className="group relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-card to-card/95 p-10 transition-all hover:shadow-lg hover:border-primary/50">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="relative">
            <h3 className="text-2xl font-bold mb-2 flex items-center gap-3">
              <span className="text-3xl">📖</span>
              <span>Vocabulary</span>
            </h3>
            <div className="mb-6 h-1 w-16 bg-gradient-to-r from-primary to-primary/50 rounded-full" />
            <ul className="space-y-5">
              <li>
                <a
                  href="https://www.lawlessfrench.com/vocabulary/emergencies-and-disasters/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group/link"
                >
                  <span className="text-sm font-semibold text-primary group-hover/link:underline">Lawless French — Emergencies &amp; Disasters</span>
                  <p className="text-sm text-muted mt-0.5 leading-snug">Learn how to talk about any kind of personal or public emergency.</p>
                </a>
              </li>
              <li>
                <a
                  href="https://lingopie.com/blog/phrases-for-emergency-in-french/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group/link"
                >
                  <span className="text-sm font-semibold text-primary group-hover/link:underline">Lingopie — Phrases for Emergency in French</span>
                  <p className="text-sm text-muted mt-0.5 leading-snug">Essential phrases for handling emergencies without stressing out.</p>
                </a>
              </li>
              <li>
                <a
                  href="https://www.renestance.com/blog/handy-guide-to-medical-terms-in-french/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group/link"
                >
                  <span className="text-sm font-semibold text-primary group-hover/link:underline">Renestance — Medical Terms in French</span>
                  <p className="text-sm text-muted mt-0.5 leading-snug">French medical vocabulary to feel confident as an expat in France.</p>
                </a>
              </li>
              <li>
                <a
                  href="https://www.fluentu.com/blog/french/french-medical-terms/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group/link"
                >
                  <span className="text-sm font-semibold text-primary group-hover/link:underline">FluentU — 140 French Medical Terms</span>
                  <p className="text-sm text-muted mt-0.5 leading-snug">Body parts, treatments, ailments — whether you're the doctor or the patient.</p>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Movies */}
        <div className="group relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-card to-card/95 p-10 transition-all hover:shadow-lg hover:border-primary/50">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="relative">
            <h3 className="text-2xl font-bold mb-2 flex items-center gap-3">
              <span className="text-3xl">🎬</span>
              <span>Movies</span>
            </h3>
            <div className="mb-6 h-1 w-16 bg-gradient-to-r from-primary to-primary/50 rounded-full" />
            <ul className="space-y-5">
              <li>
                <a
                  href="https://www.rottentomatoes.com/m/irreplaceable"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group/link"
                >
                  <span className="text-sm font-semibold text-primary group-hover/link:underline">Médecin de campagne</span>
                  <p className="text-sm text-muted mt-0.5 leading-snug">A rural doctor drama following the daily life and challenges of a country physician in France.</p>
                </a>
              </li>
              <li>
                <a
                  href="https://www.cinematheque.qc.ca/en/cinema/le-serment-dhippocrate/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group/link"
                >
                  <span className="text-sm font-semibold text-primary group-hover/link:underline">Le serment d'Hippocrate</span>
                  <p className="text-sm text-muted mt-0.5 leading-snug">Four immigrant doctors navigate the Québec healthcare system — a story of perseverance and identity.</p>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Songs */}
        <div className="group relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-card to-card/95 p-10 transition-all hover:shadow-lg hover:border-primary/50">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="relative">
            <h3 className="text-2xl font-bold mb-2 flex items-center gap-3">
              <span className="text-3xl">🎵</span>
              <span>Songs</span>
            </h3>
            <div className="mb-6 h-1 w-16 bg-gradient-to-r from-primary to-primary/50 rounded-full" />
            <ul className="space-y-5">
              <li>
                <a
                  href="https://www.songsforteaching.com/french/docteur.php"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group/link"
                >
                  <span className="text-sm font-semibold text-primary group-hover/link:underline">Songs for Teaching — Le Docteur</span>
                  <p className="text-sm text-muted mt-0.5 leading-snug">A French song designed for learners to practice healthcare and body vocabulary in a fun, memorable way.</p>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Podcasts */}
        <div className="group relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-card to-card/95 p-10 transition-all hover:shadow-lg hover:border-primary/50">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="relative">
            <h3 className="text-2xl font-bold mb-2 flex items-center gap-3">
              <span className="text-3xl">🎙️</span>
              <span>Podcasts</span>
            </h3>
            <div className="mb-6 h-1 w-16 bg-gradient-to-r from-primary to-primary/50 rounded-full" />
            <ul className="space-y-5">
              <li>
                <a
                  href="https://podcasts.apple.com/us/podcast/aller-chez-le-m%C3%A9decin-en-france/id1580594077?i=1000637012159"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group/link"
                >
                  <span className="text-sm font-semibold text-primary group-hover/link:underline">LanguaTalk — Aller chez le médecin en France</span>
                  <p className="text-sm text-muted mt-0.5 leading-snug">Slow French podcast (A2–B1) — a 26-minute episode on visiting the doctor in France.</p>
                </a>
              </li>
              <li>
                <a
                  href="https://music.youtube.com/playlist?list=OLAK5uy_lOOeoH2MlBfb9U3ebJt0EKfWr6uJYeNBM"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group/link"
                >
                  <span className="text-sm font-semibold text-primary group-hover/link:underline">French Languagetalk — Health &amp; Doctor Visits (A1)</span>
                  <p className="text-sm text-muted mt-0.5 leading-snug">Beginner podcast lesson on health, doctor visits, and medical vocabulary in French.</p>
                </a>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  )
}
