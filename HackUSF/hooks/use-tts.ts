"use client"

import { useCallback, useRef } from "react"
import type { Language } from "@/lib/types"

export function useTTS(_language: Language, region: string, voice?: string | null) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const speak = useCallback(
    async (text: string, onEnd?: () => void) => {
      if (!text?.trim()) {
        onEnd?.()
        return
      }

      // Stop any current playback
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.onended = null
        audioRef.current.onerror = null
        audioRef.current = null
      }

      try {
        const response = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, region, voice: voice ?? undefined }),
        })

        if (!response.ok) throw new Error("TTS API failed")

        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const audio = new Audio(url)
        audioRef.current = audio

        const cleanup = () => {
          URL.revokeObjectURL(url)
          audioRef.current = null
        }

        audio.onended = () => {
          cleanup()
          onEnd?.()
        }

        audio.onerror = () => {
          cleanup()
          onEnd?.()
        }

        await audio.play()
        console.log("[TTS client] playing audio, duration:", audio.duration)
      } catch (err) {
        console.error("[TTS client] play() failed:", err)
        onEnd?.()
      }
    },
    [region]
  )

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.onended = null
      audioRef.current.onerror = null
      audioRef.current = null
    }
  }, [])

  return { speak, stop }
}
