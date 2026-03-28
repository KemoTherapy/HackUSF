"use client"

import { Volume2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatBubbleProps {
  speaker: "user" | "ai"
  text: string
  translation?: string
  flag?: string
  onSpeak?: () => void
  isStreaming?: boolean
}

export function ChatBubble({
  speaker,
  text,
  translation,
  flag,
  onSpeak,
  isStreaming = false,
}: ChatBubbleProps) {
  const isUser = speaker === "user"

  const handleSpeak = () => {
    if (onSpeak) {
      onSpeak()
    } else if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "es-MX"
      speechSynthesis.speak(utterance)
    }
  }

  return (
    <div
      className={cn(
        "flex items-start gap-3 max-w-[85%]",
        isUser ? "ml-auto flex-row-reverse" : "mr-auto",
      )}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-background-elevated flex items-center justify-center shrink-0">
          <span className="text-sm">{flag || "AI"}</span>
        </div>
      )}

      {/* Bubble */}
      <div
        className={cn(
          "rounded-2xl px-4 py-3",
          isUser ? "bg-primary text-white" : "bg-background-elevated text-foreground",
        )}
      >
        <p className="leading-relaxed">
          {text}
          {isStreaming && <span className="inline-block w-1 h-4 ml-1 bg-current animate-pulse rounded-sm" />}
        </p>
        {translation && (
          <p className={cn("text-sm mt-2", isUser ? "text-white/70" : "text-muted")}>
            {translation}
          </p>
        )}
      </div>

      {/* Speaker button for AI messages */}
      {!isUser && (
        <button
          type="button"
          onClick={handleSpeak}
          className="p-2 rounded-lg hover:bg-border transition-colors shrink-0"
        >
          <Volume2 className="w-4 h-4 text-muted" />
        </button>
      )}
    </div>
  )
}
