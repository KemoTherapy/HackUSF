"use client"

import { useCallback, useRef, useEffect } from "react"
import type { Language } from "@/lib/types"

const LANG_CODE: Record<string, string> = {
  mexico:        "es-MX",
  spain:         "es-ES",
  latin_america: "es-419",
  france:        "fr-FR",
  quebec:        "fr-CA",
}

// Quality keywords — voices whose names contain these get priority
const QUALITY_KEYWORDS = ["enhanced", "premium", "neural", "natural", "compact"]

function pickBestVoice(voices: SpeechSynthesisVoice[], langCode: string): SpeechSynthesisVoice | null {
  const lang = langCode.toLowerCase()
  const base = lang.split("-")[0] // e.g. "es" from "es-MX"

  // Candidates: exact match first, then language-prefix match
  const exactMatches = voices.filter((v) => v.lang.toLowerCase() === lang)
  const prefixMatches = voices.filter((v) => v.lang.toLowerCase().startsWith(base))
  const candidates = exactMatches.length > 0 ? exactMatches : prefixMatches

  if (candidates.length === 0) return null

  // Prefer "enhanced" / "premium" / "neural" voices
  for (const keyword of QUALITY_KEYWORDS) {
    const hit = candidates.find((v) => v.name.toLowerCase().includes(keyword))
    if (hit) return hit
  }

  // Fall back to first candidate
  return candidates[0]
}

export function useTTS(language: Language, region: string) {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const voicesRef = useRef<SpeechSynthesisVoice[]>([])

  // Load voices — they arrive async via voiceschanged event
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return

    const load = () => {
      voicesRef.current = window.speechSynthesis.getVoices()
    }

    load() // try immediately (populated in some browsers)
    window.speechSynthesis.addEventListener("voiceschanged", load)
    return () => window.speechSynthesis.removeEventListener("voiceschanged", load)
  }, [])

  const speak = useCallback(
    (text: string, onEnd?: () => void) => {
      if (typeof window === "undefined" || !window.speechSynthesis) {
        onEnd?.()
        return
      }

      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      const langCode = LANG_CODE[region] || (language === "spanish" ? "es-ES" : "fr-FR")
      utterance.lang = langCode
      utterance.rate = 0.92   // slightly slower than natural — easier to follow
      utterance.pitch = 1.0
      utterance.volume = 1.0

      // Use cached voices (loaded by voiceschanged listener)
      const voices = voicesRef.current.length > 0
        ? voicesRef.current
        : window.speechSynthesis.getVoices()

      const best = pickBestVoice(voices, langCode)
      if (best) utterance.voice = best

      if (onEnd) utterance.onend = onEnd

      utteranceRef.current = utterance
      window.speechSynthesis.speak(utterance)
    },
    [language, region]
  )

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
  }, [])

  return { speak, stop }
}
