"use client"

import { cn } from "@/lib/utils"

interface SuggestionChipsProps {
  suggestions: string[]
  visible: boolean
  onSelect: (text: string) => void
}

export function SuggestionChips({ suggestions, visible, onSelect }: SuggestionChipsProps) {
  if (!suggestions.length) return null

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 transition-all duration-500",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none",
      )}
    >
      <p className="text-xs text-disabled mb-1">Tap a suggestion to respond</p>
      {suggestions.map((text, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(text)}
          className="px-5 py-2.5 rounded-full bg-card border border-border text-sm text-foreground hover:bg-primary hover:border-primary hover:text-white active:scale-95 transition-all max-w-xs text-center"
        >
          {text}
        </button>
      ))}
    </div>
  )
}
