"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { StarRating } from "@/components/ui/star-rating"
import type { LevelInfo, LevelProgress } from "@/lib/types"

interface LevelCardProps {
  level: LevelInfo
  progress: LevelProgress
  isCurrent: boolean
  onClick: () => void
}

export function LevelCard({ level, progress, isCurrent, onClick }: LevelCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative w-full h-[220px] rounded-2xl bg-card p-5 text-left transition-all duration-300 card-shadow",
        "hover:scale-[1.02] hover:bg-background-elevated focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
        isCurrent && "ring-2 ring-primary glow-primary",
        progress.completed && "ring-2 ring-success",
      )}
    >
      {/* Large CEFR code background */}
      <span className="absolute top-4 left-4 text-5xl font-extrabold text-primary/20">
        {level.level}
      </span>

      {/* Completed checkmark */}
      {progress.completed && (
        <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-success flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}

      {/* Current badge */}
      {isCurrent && !progress.completed && (
        <span className="absolute top-4 right-4 px-2 py-0.5 rounded-full text-xs font-medium bg-primary text-white">
          Current
        </span>
      )}

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end">
        <h3 className="text-lg font-semibold text-foreground mb-1">{level.name}</h3>
        <p className="text-sm text-muted mb-4 line-clamp-2">{level.description}</p>
        <StarRating earned={progress.starsEarned} size="sm" />
      </div>

      {/* Shimmer effect for completed */}
      {progress.completed && (
        <div className="absolute inset-0 rounded-2xl animate-shimmer pointer-events-none" />
      )}
    </button>
  )
}
