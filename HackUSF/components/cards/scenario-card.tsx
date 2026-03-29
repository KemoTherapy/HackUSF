"use client"

import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { StarRating } from "@/components/ui/star-rating"
import type { ScenarioInfo, CefrLevel } from "@/lib/types"

interface ScenarioCardProps {
  scenario: ScenarioInfo
  cefrLevel: CefrLevel
  starsEarned: number
  onStart: () => void
}

const difficultyByLevel: Record<CefrLevel, string> = {
  A1: "Simple phrases",
  A2: "Basic conversation",
  B1: "Detailed discussion",
  B2: "Complex negotiation",
  C1: "Nuanced dialogue",
  C2: "Advanced fluency",
}

export function ScenarioCard({
  scenario,
  cefrLevel,
  starsEarned,
  onStart,
}: ScenarioCardProps) {
  return (
    <div
      className={cn(
        "relative w-full rounded-2xl bg-card p-6 transition-all duration-300 card-shadow",
        "hover:bg-background-elevated",
      )}
    >
      {/* Title */}
      <h3 className="text-lg font-semibold text-foreground mb-2">{scenario.name}</h3>

      {/* Difficulty tag */}
      <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary mb-3">
        {difficultyByLevel[cefrLevel]}
      </span>

      {/* Time estimate */}
      <div className="flex items-center gap-1 text-sm text-muted mb-4">
        <Clock className="w-4 h-4" />
        <span>{scenario.estimatedTime}</span>
      </div>

      {/* Stars */}
      <div className="mb-4">
        <StarRating earned={starsEarned} size="sm" />
      </div>

      {/* Start button */}
      <Button onClick={onStart} className="w-full bg-primary hover:bg-primary/90 text-white">
        Start Lesson
      </Button>
    </div>
  )
}
