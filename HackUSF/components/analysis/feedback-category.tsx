"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Correction } from "@/lib/types"

interface FeedbackCategoryProps {
  title: string
  corrections: Correction[]
  className?: string
}

export function FeedbackCategory({ title, corrections, className }: FeedbackCategoryProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (corrections.length === 0) return null

  return (
    <div className={cn("bg-card rounded-2xl overflow-hidden", className)}>
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-background-elevated transition-colors"
      >
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-error/20 text-error">
            {corrections.length} {corrections.length === 1 ? "issue" : "issues"}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-muted" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted" />
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3">
          {corrections.map((correction, index) => (
            <div
              key={index}
              className="p-4 rounded-xl bg-background-elevated"
            >
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="text-error line-through">{correction.original}</span>
                <ArrowRight className="w-4 h-4 text-muted shrink-0" />
                <span className="text-success font-medium">{correction.corrected}</span>
              </div>
              <p className="text-sm text-muted">{correction.explanation}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
