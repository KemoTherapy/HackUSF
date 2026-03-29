"use client"

import { AppShell } from "@/components/layout/app-shell"
import { PageHeader } from "@/components/layout/page-header"

export default function LearnResourcesPage() {
  return (
    <AppShell showBackButton backHref="/learn/language?next=resources">
      <div className="max-w-[1200px] mx-auto px-6 py-8 md:px-12 pb-32">
        <PageHeader
          title="Resources"
          subtitle="Curated media and exercises for your chosen language"
        />

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-card rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Videos</h3>
            <p className="text-sm text-muted">Short clips and shows for language exposure.</p>
          </div>

          <div className="p-6 bg-card rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Music</h3>
            <p className="text-sm text-muted">Playlists and lyrics for practice.</p>
          </div>

          <div className="p-6 bg-card rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Articles</h3>
            <p className="text-sm text-muted">Readable content with difficulty tags.</p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
