"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/layout/app-shell"
import { PageHeader } from "@/components/layout/page-header"
import { RegionCard } from "@/components/cards/region-card"
import { Button } from "@/components/ui/button"
import { REGIONS } from "@/lib/constants"
import { useStore } from "@/lib/store"
import type { Region } from "@/lib/types"

export default function LanguageSelectionPage() {
  const router = useRouter()
  const { setLanguageAndRegion, session, setResourcesFlow } = useStore()
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null)

  // Prioritize store flag to persist resources flow through back navigation
  const inResourcesFlow = session?.resourcesFlow === true

  const spanishRegions = REGIONS.filter((r) => r.language === "spanish")
  const frenchRegions = REGIONS.filter((r) => r.language === "french")

  const handleContinue = () => {
    const region = REGIONS.find((r) => r.id === selectedRegion)
    if (region) {
      setLanguageAndRegion(region.language, region.id)
      if (inResourcesFlow) {
        router.push(`/learn/resources/${region.id}`)
      } else {
        router.push("/learn/level")
      }
    }
  }

  return (
    <AppShell showBackButton backHref="/">
      <div className="max-w-[1200px] mx-auto px-6 py-8 md:px-12 pb-32">
        <PageHeader
          title="Where do you want to learn?"
          subtitle="Choose your language and regional accent"
        />

        {/* Spanish Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">🇪🇸</span>
            <h2 className="text-xl font-semibold text-foreground">Spanish</h2>
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {spanishRegions.map((region) => (
              <RegionCard
                key={region.id}
                region={region}
                isSelected={selectedRegion === region.id}
                onClick={() => {
                  if (inResourcesFlow) {
                    setLanguageAndRegion(region.language, region.id)
                    router.push(`/learn/resources/${region.id}`)
                  } else {
                    setSelectedRegion(region.id)
                  }
                }}
              />
            ))}
          </div>
        </div>

        {/* French Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">🇫🇷</span>
            <h2 className="text-xl font-semibold text-foreground">French</h2>
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {frenchRegions.map((region) => (
              <RegionCard
                key={region.id}
                region={region}
                isSelected={selectedRegion === region.id}
                onClick={() => {
                  if (inResourcesFlow) {
                    setLanguageAndRegion(region.language, region.id)
                    router.push(`/learn/resources/${region.id}`)
                  } else {
                    setSelectedRegion(region.id)
                  }
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Continue button (fixed at bottom) */}
      {selectedRegion && (
        <div className="fixed bottom-20 md:bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm border-t border-border">
          <div className="max-w-[1200px] mx-auto">
            <Button
              onClick={handleContinue}
              className="w-full md:w-auto md:ml-auto md:flex bg-primary hover:bg-primary/90 text-white text-lg py-6"
            >
              Continue
            </Button>
          </div>
        </div>
      )}
    </AppShell>
  )
}
