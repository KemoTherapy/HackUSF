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

      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 bg-card rounded-lg">
          <h3 className="text-lg font-semibold mb-2">🎵 Songs</h3>
          <p className="text-sm text-muted">Songs and playlists from {region.name} with lyrics and translations.</p>
        </div>

        <div className="p-6 bg-card rounded-lg">
          <h3 className="text-lg font-semibold mb-2">🎧 Podcasts</h3>
          <p className="text-sm text-muted">Podcasts produced in {region.name} for authentic language immersion.</p>
        </div>

        <div className="p-6 bg-card rounded-lg">
          <h3 className="text-lg font-semibold mb-2">🎬 Movies</h3>
          <p className="text-sm text-muted">Films and TV shows featuring {region.name} culture and dialect.</p>
        </div>
      </div>
    </div>
  )
}
