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
  // Keep callbacks in refs so onend always has the latest version
  const onResultRef = useRef(onResult)
  const onErrorRef = useRef(onError)

  useEffect(() => { onResultRef.current = onResult }, [onResult])
  useEffect(() => { onErrorRef.current = onError }, [onError])

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
      transcriptRef.current += newTranscript
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      if (event.error !== "aborted" && event.error !== "no-speech") {
        onErrorRef.current?.("Microphone error. Please try again.")
      }
      setIsRecording(false)
    }

    // onend fires AFTER all onresult events — safe to read the full transcript here
    recognition.onend = () => {
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
  }, [isSupported, language, region])

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop() // triggers onend, which fires onResult
      recognitionRef.current = null
    }
  }, [])

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }, [isRecording, startRecording, stopRecording])

  return { isRecording, isSupported, toggleRecording, startRecording, stopRecording }
}
