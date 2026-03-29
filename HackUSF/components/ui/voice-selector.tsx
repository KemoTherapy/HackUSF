"use client"

import { useState } from "react"
import { Volume2, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { VOICES_BY_REGION } from "@/lib/constants"
import { useStore } from "@/lib/store"
import type { Region } from "@/lib/types"

interface VoiceSelectorProps {
  region: Region
  className?: string
}

export function VoiceSelector({ region, className }: VoiceSelectorProps) {
  const [open, setOpen] = useState(false)
  const { session, setVoice } = useStore()

  const voices = VOICES_BY_REGION[region] ?? []
  if (voices.length <= 1) return null  // nothing to choose from

  const currentVoice = session.voice ?? voices[0]?.id
  const currentName = voices.find((v) => v.id === currentVoice)?.name ?? voices[0]?.name

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-border text-sm text-muted hover:text-foreground hover:border-primary/50 transition-colors"
        title="Change voice"
      >
        <Volume2 className="w-3.5 h-3.5" />
        <span>{currentName}</span>
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 z-50 w-48 bg-card border border-border rounded-xl shadow-lg overflow-hidden">
            <p className="text-xs text-disabled px-3 pt-2.5 pb-1 uppercase tracking-wider">Voice</p>
            {voices.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => {
                  setVoice(v.id)
                  setOpen(false)
                }}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 text-sm hover:bg-background-elevated transition-colors",
                  v.id === currentVoice ? "text-foreground" : "text-muted",
                )}
              >
                <span className="flex items-center gap-2">
                  <span>{v.gender === "female" ? "♀" : "♂"}</span>
                  <span>{v.name}</span>
                </span>
                {v.id === currentVoice && <Check className="w-3.5 h-3.5 text-primary" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
