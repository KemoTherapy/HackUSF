"use client"

import { X, Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"

interface HintPanelProps {
  hints: string[]
  isOpen: boolean
  onClose: () => void
}

export function HintPanel({ hints, isOpen, onClose }: HintPanelProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={cn(
          "relative w-full max-w-lg bg-card rounded-t-2xl p-6 transform transition-transform",
          isOpen ? "translate-y-0" : "translate-y-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-warning" />
            <h3 className="font-semibold text-foreground">Hints</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-border transition-colors"
          >
            <X className="w-5 h-5 text-muted" />
          </button>
        </div>

        {/* Hints list */}
        <ul className="space-y-3">
          {hints.map((hint, index) => (
            <li
              key={index}
              className="flex items-start gap-3 p-3 rounded-xl bg-background-elevated"
            >
              <span className="w-6 h-6 rounded-full bg-warning/20 text-warning flex items-center justify-center text-sm font-medium shrink-0">
                {index + 1}
              </span>
              <p className="text-foreground">{hint}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
