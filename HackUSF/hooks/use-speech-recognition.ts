"use client"

import { useState, useRef, useCallback } from "react"
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
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyWindow = Window & { SpeechRecognition?: any; webkitSpeechRecognition?: any }

export function useSpeechRecognition({
  language,
  region,
  onResult,
  onError,
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

  const startRecording = useCallback(() => {
    if (!isSupported) {
      onError?.("Speech recognition requires Chrome or Edge.")
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
      transcriptRef.current += newTranscript
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      if (event.error !== "aborted") {
        onError?.(event.error === "no-speech" ? "No speech detected. Try again." : "Microphone error.")
      }
      setIsRecording(false)
    }

    recognition.onend = () => {
      setIsRecording(false)
    }

    recognitionRef.current = recognition
    recognition.start()
    setIsRecording(true)
  }, [isSupported, language, region, onError])

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    setIsRecording(false)
    const result = transcriptRef.current.trim()
    if (result) {
      onResult(result)
    }
    transcriptRef.current = ""
  }, [onResult])

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }, [isRecording, startRecording, stopRecording])

  return { isRecording, isSupported, toggleRecording, startRecording, stopRecording }
}
