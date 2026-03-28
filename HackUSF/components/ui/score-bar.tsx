"use client"

import { cn, getScoreColor } from "@/lib/utils"

interface ScoreBarProps {
  label: string
  score: number
  color?: string
  className?: string
}

export function ScoreBar({ label, score, color, className }: ScoreBarProps) {
  const barColor = color || getScoreColor(score)

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <span className="text-sm text-muted w-28 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500 ease-out", barColor)}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-sm font-medium w-10 text-right">{score}</span>
    </div>
  )
}
