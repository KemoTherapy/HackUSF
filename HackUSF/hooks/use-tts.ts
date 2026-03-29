"use client"

import { useCallback, useRef } from "react"
import type { Language } from "@/lib/types"

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
    (text: string, onEnd?: () => void) => {
      if (typeof window === "undefined" || !window.speechSynthesis) {
        onEnd?.()
        return
      }

      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = LANG_CODE[region] || (language === "spanish" ? "es-ES" : "fr-FR")
      utterance.rate = 0.9
      utterance.pitch = 1

      const voices = window.speechSynthesis.getVoices()
      const langCode = utterance.lang
      const matchingVoice =
        voices.find((v) => v.lang === langCode) ||
        voices.find((v) => v.lang.startsWith(langCode.split("-")[0]))
      if (matchingVoice) utterance.voice = matchingVoice

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
