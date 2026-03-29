"use client"

import { AppShell } from "@/components/layout/app-shell"
import { PageHeader } from "@/components/layout/page-header"

export default function LearnResourcesPage() {
  return (
    <AppShell showBackButton backHref="/learn/language">
      <div className="max-w-[1200px] mx-auto px-6 py-8 md:px-12 pb-32">
        <PageHeader
          title="Resources"
          subtitle="Curated media and exercises for your chosen language"
        />

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-card rounded-lg">
            <h3 className="text-lg font-semibold mb-2">🎵 Songs</h3>
            <p className="text-sm text-muted">Practice listening and singing along with curated playlists and lyrics.</p>
          </div>

          <div className="p-6 bg-card rounded-lg">
            <h3 className="text-lg font-semibold mb-2">�️ Podcasts</h3>
            <p className="text-sm text-muted">Listen to engaging podcast episodes tailored to your level.</p>
          </div>

          <div className="p-6 bg-card rounded-lg">
            <h3 className="text-lg font-semibold mb-2">🎬 Movies</h3>
            <p className="text-sm text-muted">Watch films and TV shows to immerse yourself in the language naturally.</p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
