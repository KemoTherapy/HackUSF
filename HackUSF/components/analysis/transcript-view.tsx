"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import type { Correction } from "@/lib/types"

interface TranscriptViewProps {
  original: string
  corrections: Correction[]
  className?: string
}

export function TranscriptView({ original, corrections, className }: TranscriptViewProps) {
  const [view, setView] = useState<"original" | "corrected">("original")

  // Apply corrections to text
  const getCorrectedText = () => {
    let text = original
    corrections.forEach((correction) => {
      text = text.replace(correction.original, correction.corrected)
    })
    return text
  }

  const highlightCorrections = (text: string) => {
    let highlighted = text
    corrections.forEach((correction) => {
      if (view === "original") {
        highlighted = highlighted.replace(
          correction.original,
          `<span class="line-through text-error">${correction.original}</span>`,
        )
      }
    })
    return highlighted
  }

  return (
    <div className={cn("bg-card rounded-2xl p-6", className)}>
      <h3 className="font-semibold text-foreground mb-4">Transcript</h3>

      {/* Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setView("original")}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            view === "original"
              ? "bg-primary text-white"
              : "bg-background-elevated text-muted hover:text-foreground",
          )}
        >
          Your words
        </button>
        <button
          type="button"
          onClick={() => setView("corrected")}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            view === "corrected"
              ? "bg-primary text-white"
              : "bg-background-elevated text-muted hover:text-foreground",
          )}
        >
          Corrected
        </button>
      </div>

      {/* Text */}
      <div className="p-4 rounded-xl bg-background-elevated">
        {view === "original" ? (
          <p
            className="text-foreground leading-relaxed"
            dangerouslySetInnerHTML={{ __html: highlightCorrections(original) }}
          />
        ) : (
          <p className="text-success leading-relaxed">{getCorrectedText()}</p>
        )}
      </div>
    </div>
  )
}
