"use client"

import { useCallback, useRef } from "react"
import type { Language, Region } from "@/lib/types"

const LANG_CODE: Record<string, string> = {
  mexico: "es-MX",
  spain: "es-ES",
  latin_america: "es-419",
  france: "fr-FR",
  quebec: "fr-CA",
}

export function useTTS(language: Language, region: string) {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  const speak = useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !window.speechSynthesis) return

      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = LANG_CODE[region] || (language === "spanish" ? "es-ES" : "fr-FR")
      utterance.rate = 0.9
      utterance.pitch = 1

      // Try to find a matching voice
      const voices = window.speechSynthesis.getVoices()
      const langCode = utterance.lang
      const matchingVoice =
        voices.find((v) => v.lang === langCode) ||
        voices.find((v) => v.lang.startsWith(langCode.split("-")[0]))
      if (matchingVoice) {
        utterance.voice = matchingVoice
      }

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
