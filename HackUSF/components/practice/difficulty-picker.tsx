"use client"

import { cn } from "@/lib/utils"
import type { CefrLevel } from "@/lib/types"

interface DifficultyPickerProps {
  selected: CefrLevel | null
  onSelect: (level: CefrLevel) => void
  className?: string
}

const levels: CefrLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"]

export function DifficultyPicker({ selected, onSelect, className }: DifficultyPickerProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <label className="text-sm text-muted">Choose your difficulty</label>
      <div className="flex flex-wrap gap-2">
        {levels.map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => onSelect(level)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors",
              selected === level
                ? "bg-primary text-white"
                : "bg-transparent border border-border text-muted hover:text-foreground hover:border-muted",
            )}
          >
            {level}
          </button>
        ))}
      </div>
    </div>
  )
}
