"use client"

import { useRouter } from "next/navigation"
import { AppShell } from "@/components/layout/app-shell"
import { PageHeader } from "@/components/layout/page-header"
import { ScenarioCard } from "@/components/cards/scenario-card"
import { CefrBadge } from "@/components/ui/cefr-badge"
import { scenariosForLevel, REGIONS } from "@/lib/constants"
import { useStore } from "@/lib/store"
import type { Scenario } from "@/lib/types"

export default function ScenariosPage() {
  const router = useRouter()
  const { session, isHydrated } = useStore()

  const selectedRegion = REGIONS.find((r) => r.id === session.region)

  const handleStartScenario = (scenarioId: Scenario) => {
    // Navigate to lesson with scenario in query params
    router.push(`/learn/lesson?scenario=${scenarioId}`)
  }

  const availableScenarios = scenariosForLevel(session.currentLevel)

  // Calculate stars earned for each scenario at current level
  const getScenarioStars = (scenarioId: Scenario): number => {
    const levelProgress = session.levelProgress[session.currentLevel]
    if (levelProgress.scenariosCompleted.includes(scenarioId)) {
      return Math.max(1, Math.floor(levelProgress.starsEarned / availableScenarios.length))
    }
    return 0
  }

  if (!isHydrated) {
    return null
  }

  return (
    <AppShell showBackButton backHref="/learn/level">
      <div className="max-w-[1200px] mx-auto px-6 py-8 md:px-12 pb-32">
        <PageHeader
          title="Choose a Scenario"
          breadcrumb={
            <div className="flex items-center justify-center gap-2">
              {selectedRegion && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card text-sm">
                  <span>{selectedRegion.flag}</span>
                  <span className="text-foreground">{selectedRegion.dialect}</span>
                </span>
              )}
              <CefrBadge level={session.currentLevel} />
            </div>
          }
        />

        {/* Scenario grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {availableScenarios.map((scenario) => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              cefrLevel={session.currentLevel}
              starsEarned={getScenarioStars(scenario.id)}
              onStart={() => handleStartScenario(scenario.id)}
            />
          ))}
        </div>
      </div>
    </AppShell>
  )
}
