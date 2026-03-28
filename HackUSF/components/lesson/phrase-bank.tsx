"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Volume2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Phrase } from "@/lib/types"

interface PhraseBankProps {
  phrases: Phrase[]
  className?: string
}

export function PhraseBank({ phrases, className }: PhraseBankProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleSpeak = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "es-MX"
      speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className={cn("bg-card rounded-2xl", className)}>
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <h3 className="font-semibold text-foreground">Useful Phrases</h3>
        {isCollapsed ? (
          <ChevronDown className="w-5 h-5 text-muted" />
        ) : (
          <ChevronUp className="w-5 h-5 text-muted" />
        )}
      </button>

      {/* Phrases list */}
      {!isCollapsed && (
        <div className="px-4 pb-4 space-y-3">
          {phrases.map((phrase, index) => (
            <div
              key={index}
              className="p-3 rounded-xl bg-background-elevated group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="font-medium text-foreground">{phrase.phrase}</p>
                  <p className="text-sm text-muted mt-1">{phrase.translation}</p>
                  {phrase.phonetic && (
                    <p className="text-xs text-disabled italic mt-1">
                      {phrase.phonetic}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleSpeak(phrase.phrase)}
                  className="p-2 rounded-lg hover:bg-border transition-colors"
                >
                  <Volume2 className="w-4 h-4 text-muted" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
