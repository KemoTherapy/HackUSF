"use client"

import { cn } from "@/lib/utils"
import type { Turn, Correction } from "@/lib/types"

interface ConversationTranscriptProps {
  turns: Turn[]
  corrections?: Correction[]
  flag?: string
  className?: string
}

export function ConversationTranscript({
  turns,
  corrections = [],
  flag,
  className,
}: ConversationTranscriptProps) {
  if (!turns || turns.length === 0) {
    return null
  }

  // Build a set of originals that need highlighting
  const correctionMap = new Map(corrections.map((c) => [c.original, c]))

  const highlightErrors = (text: string) => {
    let result = text
    correctionMap.forEach((correction) => {
      if (result.includes(correction.original)) {
        result = result.replace(
          correction.original,
          `<span class="underline decoration-error/70 decoration-wavy text-error/90" title="${correction.corrected}">${correction.original}</span>`,
        )
      }
    })
    return result
  }

  return (
    <div className={cn("bg-card rounded-2xl p-6", className)}>
      <h3 className="font-semibold text-foreground mb-5">Conversation</h3>
      <div className="space-y-4">
        {turns.map((turn) => {
          const isUser = turn.speaker === "user"
          return (
            <div
              key={turn.id}
              className={cn(
                "flex items-start gap-3",
                isUser ? "flex-row-reverse" : "flex-row",
              )}
            >
              {/* Avatar */}
              {!isUser && (
                <div className="w-7 h-7 rounded-full bg-background-elevated flex items-center justify-center shrink-0 text-sm mt-0.5">
                  {flag || "AI"}
                </div>
              )}
              {isUser && (
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-xs text-primary font-bold mt-0.5">
                  You
                </div>
              )}

              {/* Bubble */}
              <div
                className={cn(
                  "max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                  isUser
                    ? "bg-primary/15 text-foreground"
                    : "bg-background-elevated text-foreground",
                )}
                // Only highlight errors in user turns
                {...(isUser && corrections.length > 0
                  ? { dangerouslySetInnerHTML: { __html: highlightErrors(turn.text) } }
                  : { children: turn.text }
                )}
              />
            </div>
          )
        })}
      </div>

      {corrections.length > 0 && (
        <p className="text-xs text-muted mt-4 pt-4 border-t border-border">
          <span className="underline decoration-error/70 decoration-wavy text-error/90">Underlined</span> phrases have corrections. Check the feedback section below.
        </p>
      )}
    </div>
  )
}
