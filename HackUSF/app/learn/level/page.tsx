"use client"

import { useRouter } from "next/navigation"
import { AppShell } from "@/components/layout/app-shell"
import { PageHeader } from "@/components/layout/page-header"
import { LevelCard } from "@/components/cards/level-card"
import { LEVELS, REGIONS } from "@/lib/constants"
import { useStore } from "@/lib/store"

export default function LevelSelectionPage() {
  const router = useRouter()
  const { session, setCurrentLevel, isHydrated } = useStore()

  const selectedRegion = REGIONS.find((r) => r.id === session.region)

  const handleLevelSelect = (level: (typeof LEVELS)[number]["level"]) => {
    setCurrentLevel(level)
    router.push("/learn/scenarios")
  }

  if (!isHydrated) {
    return null
  }

  return (
    <AppShell showBackButton backHref="/learn/language">
      <div className="max-w-[1200px] mx-auto px-6 py-8 md:px-12 pb-32">
        <PageHeader
          title="Choose Your Level"
          subtitle="All levels are open. Pick where you want to start."
          breadcrumb={
            selectedRegion && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card text-sm">
                <span>{selectedRegion.flag}</span>
                <span className="text-foreground">{selectedRegion.dialect}</span>
              </span>
            )
          }
        />

        {/* Level grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {LEVELS.map((level) => (
            <LevelCard
              key={level.level}
              level={level}
              progress={session.levelProgress[level.level]}
              isCurrent={session.currentLevel === level.level}
              onClick={() => handleLevelSelect(level.level)}
            />
          ))}
        </div>
      </div>
    </AppShell>
  )
}
