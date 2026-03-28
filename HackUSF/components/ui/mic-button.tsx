"use client"

import { Mic, Square } from "lucide-react"
import { cn } from "@/lib/utils"

interface MicButtonProps {
  isRecording: boolean
  onToggle: () => void
  disabled?: boolean
  className?: string
}

export function MicButton({
  isRecording,
  onToggle,
  disabled = false,
  className,
}: MicButtonProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Pulse ring when recording */}
      {isRecording && (
        <div className="absolute inset-0 rounded-full bg-error/30 animate-pulse-ring" />
      )}
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        className={cn(
          "relative z-10 w-[60px] h-[60px] rounded-full flex items-center justify-center transition-all duration-200",
          isRecording
            ? "bg-error hover:bg-error/90"
            : "bg-primary hover:bg-primary/90 glow-primary",
          disabled && "opacity-50 cursor-not-allowed bg-disabled",
        )}
      >
        {isRecording ? (
          <Square className="w-6 h-6 text-white fill-white" />
        ) : (
          <Mic className="w-6 h-6 text-white" />
        )}
      </button>
    </div>
  )
}
