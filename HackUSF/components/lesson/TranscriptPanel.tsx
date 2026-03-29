"use client"

import { X, Captions } from "lucide-react"
import { cn } from "@/lib/utils"

interface TranscriptPanelProps {
  isOpen: boolean
  onClose: () => void
  aiText: string
  translation: string
  isLoadingTranslation: boolean
}

export function TranscriptPanel({
  isOpen,
  onClose,
  aiText,
  translation,
  isLoadingTranslation,
}: TranscriptPanelProps) {
  return (
    <>
      {/* Backdrop — only on small screens */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Side panel */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full z-50 w-80 bg-card border-l border-border flex flex-col transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <Captions className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground text-sm">Live Transcript</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-border transition-colors"
          >
            <X className="w-4 h-4 text-muted" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-6">
          {/* AI speech text */}
          <div>
            <p className="text-xs font-medium text-muted uppercase tracking-wider mb-2">
              AI is saying
            </p>
            {aiText ? (
              <p className="text-base text-foreground leading-relaxed">
                {aiText}
              </p>
            ) : (
              <p className="text-sm text-disabled italic">Waiting for AI to speak...</p>
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Translation */}
          <div>
            <p className="text-xs font-medium text-muted uppercase tracking-wider mb-2">
              Translation
            </p>
            {isLoadingTranslation ? (
              <div className="space-y-2">
                <div className="h-3 bg-border rounded animate-pulse w-full" />
                <div className="h-3 bg-border rounded animate-pulse w-4/5" />
                <div className="h-3 bg-border rounded animate-pulse w-3/5" />
              </div>
            ) : translation ? (
              <p className="text-base text-foreground/80 leading-relaxed">
                {translation}
              </p>
            ) : (
              <p className="text-sm text-disabled italic">
                {aiText ? "Loading translation..." : "Translation will appear here"}
              </p>
            )}
          </div>
        </div>

        {/* Footer note */}
        <div className="px-5 py-3 border-t border-border shrink-0">
          <p className="text-xs text-disabled text-center">Tap anywhere outside to close on mobile</p>
        </div>
      </div>
    </>
  )
}
