"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import type { Language } from "@/lib/types"

const LANG_CODE: Record<string, string> = {
  mexico: "es-MX",
  spain: "es-ES",
  latin_america: "es-419",
  france: "fr-FR",
  quebec: "fr-CA",
}

interface UseSpeechRecognitionOptions {
  language: Language
  region: string
  onResult: (transcript: string) => void
  onError?: (error: string) => void
  silenceMs?: number // auto-stop after this many ms of silence (default 2000)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyWindow = Window & { SpeechRecognition?: any; webkitSpeechRecognition?: any }

export function useSpeechRecognition({
  language,
  region,
  onResult,
  onError,
  silenceMs = 2000,
}: UseSpeechRecognitionOptions) {
  const [isRecording, setIsRecording] = useState(false)
  const [isSupported] = useState(() => {
    if (typeof window === "undefined") return false
    const w = window as AnyWindow
    return !!(w.SpeechRecognition || w.webkitSpeechRecognition)
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)
  const transcriptRef = useRef("")
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Keep callbacks in refs so onend always has the latest version
  const onResultRef = useRef(onResult)
  const onErrorRef = useRef(onError)
  useEffect(() => { onResultRef.current = onResult }, [onResult])
  useEffect(() => { onErrorRef.current = onError }, [onError])

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = null
    }
  }, [])

  const startRecording = useCallback(() => {
    if (!isSupported) {
      onErrorRef.current?.("Speech recognition requires Chrome or Edge.")
      return
    }

    const w = window as AnyWindow
    const SpeechRecognitionImpl = w.SpeechRecognition || w.webkitSpeechRecognition
    if (!SpeechRecognitionImpl) return

    const recognition = new SpeechRecognitionImpl()
    recognition.lang = LANG_CODE[region] || (language === "spanish" ? "es-ES" : "fr-FR")
    recognition.continuous = true
    recognition.interimResults = false

    transcriptRef.current = ""

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let newTranscript = ""
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          newTranscript += event.results[i][0].transcript + " "
        }
      }
      if (newTranscript.trim()) {
        transcriptRef.current += newTranscript
        // Reset silence timer on each new speech result
        clearSilenceTimer()
        silenceTimerRef.current = setTimeout(() => {
          // Auto-stop after silence — triggers onend which fires onResult
          if (recognitionRef.current) {
            recognitionRef.current.stop()
          }
        }, silenceMs)
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      clearSilenceTimer()
      if (event.error !== "aborted" && event.error !== "no-speech") {
        onErrorRef.current?.("Microphone error. Please try again.")
      }
      setIsRecording(false)
    }

    // onend fires AFTER all onresult events — safe to read the full transcript here
    recognition.onend = () => {
      clearSilenceTimer()
      recognitionRef.current = null
      setIsRecording(false)
      const result = transcriptRef.current.trim()
      transcriptRef.current = ""
      if (result) {
        onResultRef.current(result)
      }
    }

    recognitionRef.current = recognition
    recognition.start()
    setIsRecording(true)
  }, [isSupported, language, region, silenceMs, clearSilenceTimer])

  const stopRecording = useCallback(() => {
    clearSilenceTimer()
    if (recognitionRef.current) {
      recognitionRef.current.stop() // triggers onend → onResult
      recognitionRef.current = null
    }
  }, [clearSilenceTimer])

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }, [isRecording, startRecording, stopRecording])

  return { isRecording, isSupported, toggleRecording, startRecording, stopRecording }
}
