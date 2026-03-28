"use client"

import { cn } from "@/lib/utils"

interface AudioWaveformProps {
  isActive: boolean
  className?: string
}

export function AudioWaveform({ isActive, className }: AudioWaveformProps) {
  return (
    <div className={cn("flex items-center justify-center gap-1 h-6", className)}>
      {[0, 1, 2, 3, 4].map((index) => (
        <div
          key={index}
          className={cn(
            "w-1 bg-error rounded-full transition-all",
            isActive ? "animate-[waveform_0.5s_ease-in-out_infinite]" : "h-1",
          )}
          style={{
            animationDelay: isActive ? `${index * 0.1}s` : undefined,
            height: isActive ? undefined : "4px",
          }}
        />
      ))}
    </div>
  )
}
