"use client"

import { useEffect } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { useStore } from "@/lib/store"
import { REGIONS } from "@/lib/constants"

export function ClientRegionResources({ region }: { region: typeof REGIONS[number] }) {
  const { setLanguageAndRegion } = useStore()

  useEffect(() => {
    if (region) setLanguageAndRegion(region.language, region.id)
  }, [region, setLanguageAndRegion])

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8 md:px-12 pb-32">
      <PageHeader
        title={`${region.name} Resources`}
        subtitle={`Curated resources for ${region.name} (${region.language})`}
      />

      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 bg-card rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Videos</h3>
          <p className="text-sm text-muted">Videos tailored to {region.name} dialect.</p>
        </div>

        <div className="p-6 bg-card rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Music</h3>
          <p className="text-sm text-muted">Local playlists and lyrics for {region.name} speakers.</p>
        </div>

        <div className="p-6 bg-card rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Articles</h3>
          <p className="text-sm text-muted">Articles and reading material aligned with {region.name} dialect.</p>
        </div>
      </div>
    </div>
  )
}
