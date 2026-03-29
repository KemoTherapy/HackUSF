"use client"

import { useState } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { PageHeader } from "@/components/layout/page-header"
import { DifficultyPicker } from "@/components/practice/difficulty-picker"
import { ModePicker } from "@/components/practice/mode-picker"
import { REGIONS } from "@/lib/constants"
import { useStore } from "@/lib/store"
import type { CefrLevel, Region } from "@/lib/types"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

export default function PracticeHomePage() {
  const { session, setLanguageAndRegion, setCurrentLevel, isHydrated } = useStore()
  const [selectedLevel, setSelectedLevel] = useState<CefrLevel | null>(session.currentLevel || null)

  const selectedRegion = REGIONS.find((r) => r.id === session.region) || REGIONS[0]

  const handleRegionChange = (region: Region) => {
    const regionData = REGIONS.find((r) => r.id === region)
    if (regionData) {
      setLanguageAndRegion(regionData.language, regionData.id)
    }
  }

  const handleLevelSelect = (level: CefrLevel) => {
    setSelectedLevel(level)
    setCurrentLevel(level)
  }

  if (!isHydrated) {
    return null
  }

  return (
    <AppShell showBackButton backHref="/">
      <div className="max-w-[1200px] mx-auto px-6 py-8 md:px-12 pb-32">
        <PageHeader
          title="Practice Mode"
          subtitle="No lesson, no pressure. Just practice."
        />

        {/* Language selector */}
        <div className="flex justify-center mb-8">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card text-sm hover:bg-background-elevated transition-colors">
                <span>{selectedRegion.flag}</span>
                <span className="text-foreground">{selectedRegion.dialect}</span>
                <ChevronDown className="w-4 h-4 text-muted" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
              {REGIONS.map((region) => (
                <DropdownMenuItem
                  key={region.id}
                  onClick={() => handleRegionChange(region.id)}
                  className="gap-2"
                >
                  <span>{region.flag}</span>
                  <span>{region.dialect}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Step 1: Difficulty */}
        <div className="mb-12">
          <DifficultyPicker
            selected={selectedLevel}
            onSelect={handleLevelSelect}
          />
        </div>

        {/* Step 2: Mode selection (appears after difficulty selected) */}
        {selectedLevel && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <ModePicker selectedLevel={selectedLevel} />
          </div>
        )}
      </div>
    </AppShell>
  )
}
