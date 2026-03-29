"use client"

import { cn } from "@/lib/utils"

export type OrbState = "idle" | "listening" | "thinking" | "speaking"

interface ConversationOrbProps {
  state: OrbState
  className?: string
}

const STATE_LABEL: Record<OrbState, string> = {
  idle:      "Tap the mic to speak",
  listening: "Listening...",
  thinking:  "Thinking...",
  speaking:  "Speaking...",
}

export function ConversationOrb({ state, className }: ConversationOrbProps) {
  return (
    <div className={cn("flex flex-col items-center gap-8 select-none", className)}>
      {/* Orb container — rings live here */}
      <div className="relative flex items-center justify-center w-64 h-64">

        {/* Expanding rings — only when listening */}
        {state === "listening" && (
          <>
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ring-1" />
            <div className="absolute inset-0 rounded-full bg-primary/15 animate-ring-2" />
            <div className="absolute inset-0 rounded-full bg-primary/10 animate-ring-3" />
          </>
        )}

        {/* Spinner ring — thinking */}
        {state === "thinking" && (
          <div
            className="absolute inset-[-8px] rounded-full animate-orb-spin"
            style={{
              background: "conic-gradient(from 0deg, transparent 0%, #6C63FF 40%, transparent 60%)",
              borderRadius: "50%",
            }}
          />
        )}

        {/* Orb core */}
        <div
          className={cn(
            "relative w-48 h-48 rounded-full transition-all duration-500",
            state === "idle"      && "animate-orb-breathe",
            state === "listening" && "animate-orb-listen",
            state === "speaking"  && "animate-orb-speak",
            state === "thinking"  && "opacity-80",
          )}
          style={{
            background: state === "speaking"
              ? "radial-gradient(circle at 35% 32%, #88ede8, #4ECDC4 45%, #2a9e97)"
              : state === "listening"
              ? "radial-gradient(circle at 35% 32%, #a8a2ff, #6C63FF 45%, #3f37cc)"
              : state === "thinking"
              ? "radial-gradient(circle at 35% 32%, #9c8fff, #5a52e0 45%, #2e27a0)"
              : "radial-gradient(circle at 35% 32%, #8a84e8, #6C63FF 45%, #4038c0)",
            boxShadow: state === "speaking"
              ? "inset -6px -6px 16px rgba(0,0,0,0.35), inset 6px 6px 16px rgba(255,255,255,0.12), 0 0 60px rgba(78,205,196,0.5)"
              : "inset -6px -6px 16px rgba(0,0,0,0.35), inset 6px 6px 16px rgba(255,255,255,0.12), 0 0 50px rgba(108,99,255,0.45)",
          }}
        >
          {/* Inner highlight — gives 3D depth */}
          <div
            className="absolute top-5 left-7 w-14 h-10 rounded-full opacity-30"
            style={{
              background: "radial-gradient(ellipse, rgba(255,255,255,0.9) 0%, transparent 70%)",
              filter: "blur(4px)",
            }}
          />

          {/* Speaking bars — visible only when AI is speaking */}
          {state === "speaking" && (
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-end gap-[3px] h-8">
              {[0.2, 0.5, 1, 0.7, 1, 0.5, 0.2].map((delay, i) => (
                <div
                  key={i}
                  className="w-[3px] rounded-full bg-white/80 animate-bar-wave"
                  style={{
                    height: "100%",
                    animationDelay: `${delay * 0.4}s`,
                    transformOrigin: "bottom",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Status label */}
      <p
        className={cn(
          "text-base font-medium tracking-wide transition-all duration-300",
          state === "idle"      && "text-muted",
          state === "listening" && "text-primary",
          state === "thinking"  && "text-muted animate-pulse",
          state === "speaking"  && "text-tertiary",
        )}
      >
        {STATE_LABEL[state]}
      </p>
    </div>
  )
}
