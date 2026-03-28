"use client"

import { ChevronRight } from "lucide-react"
import { cn, formatRelativeTime } from "@/lib/utils"
import { StarRating } from "@/components/ui/star-rating"
import { CefrBadge } from "@/components/ui/cefr-badge"
import { SCENARIOS, REGIONS } from "@/lib/constants"
import type { PracticeSession } from "@/lib/types"

interface SessionHistoryCardProps {
  session: PracticeSession
  onClick: () => void
}

export function SessionHistoryCard({ session, onClick }: SessionHistoryCardProps) {
  const scenario = SCENARIOS.find((s) => s.id === session.scenario)
  const region = REGIONS.find((r) => r.id === session.region)

  const modeLabels = {
    lesson: "Lesson",
    speaking: "Speaking",
    writing: "Writing",
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-2xl bg-card p-4 text-left transition-all duration-300 card-shadow",
        "hover:bg-background-elevated focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
      )}
    >
      <div className="flex items-start justify-between">
        {/* Left side */}
        <div className="flex items-start gap-3">
          {/* Icon */}
          <span className="text-2xl">
            {scenario?.icon || (session.mode === "speaking" ? "🎤" : "📖")}
          </span>

          <div>
            {/* Title */}
            <h3 className="font-semibold text-foreground">
              {scenario?.name || session.topic || "Free Practice"}
            </h3>

            {/* Mode and level badges */}
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-background-elevated text-muted">
                {modeLabels[session.mode]}
              </span>
              <CefrBadge level={session.cefrLevel} size="sm" />
            </div>

            {/* Region */}
            <div className="flex items-center gap-1 mt-2 text-sm text-muted">
              <span>{region?.flag}</span>
              <span>{region?.dialect}</span>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex flex-col items-end gap-2">
          {/* Score */}
          <span className="text-sm font-medium text-foreground">
            Score: {session.score || 0}/100
          </span>

          {/* Stars */}
          {session.starsEarned !== undefined && (
            <StarRating earned={session.starsEarned} size="sm" />
          )}

          {/* Time */}
          <span className="text-xs text-muted">
            {formatRelativeTime(session.startTime)}
          </span>
        </div>
      </div>

      {/* View details link */}
      <div className="flex items-center justify-end mt-3 text-sm text-primary">
        <span>View Details</span>
        <ChevronRight className="w-4 h-4" />
      </div>
    </button>
  )
}
