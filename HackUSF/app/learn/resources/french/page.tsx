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
          subtitle="Learn French with curated media from France, Quebec, and beyond"
        />

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-card rounded-lg">
            <h3 className="text-lg font-semibold mb-2">🎵 Songs</h3>
            <p className="text-sm text-muted">French music, chanson, and contemporary artists with lyrics and translations.</p>
          </div>

          <div className="p-6 bg-card rounded-lg">
            <h3 className="text-lg font-semibold mb-2">�️ Podcasts</h3>
            <p className="text-sm text-muted">French podcasts covering news, culture, education, and entertainment.</p>
          </div>

          <div className="p-6 bg-card rounded-lg">
            <h3 className="text-lg font-semibold mb-2">🎬 Movies</h3>
            <p className="text-sm text-muted">French cinema, documentaries, and TV shows from Europe and beyond.</p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
