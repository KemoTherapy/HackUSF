"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CefrBadge } from "@/components/ui/cefr-badge"
import { MicButton } from "@/components/ui/mic-button"
import { ConversationOrb, type OrbState } from "@/components/conversation/ConversationOrb"
import { REGIONS, PRACTICE_TOPICS } from "@/lib/constants"
import { VoiceSelector } from "@/components/ui/voice-selector"
import { useStore } from "@/lib/store"
import { sendMessage, endSession } from "@/lib/api"
import { useSpeechRecognition } from "@/hooks/use-speech-recognition"
import { useTTS } from "@/hooks/use-tts"
import { formatTime } from "@/lib/utils"
import type { Turn, CefrLevel, PracticeTopic } from "@/lib/types"

function SpeakingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const levelParam = searchParams.get("level") as CefrLevel | null
  const { session, isHydrated, addPracticeSession } = useStore()

  const [sessionId] = useState(() => crypto.randomUUID())
  const [turns, setTurns] = useState<Turn[]>([])
  const [selectedTopic, setSelectedTopic] = useState<PracticeTopic | null>(null)
  const [orbState, setOrbState] = useState<OrbState>("idle")
  const [elapsedTime, setElapsedTime] = useState(0)
  const [speechError, setSpeechError] = useState<string | null>(null)
  const [isEnding, setIsEnding] = useState(false)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const conversationHistory = useRef<{ role: "user" | "assistant"; content: string }[]>([])

  const region = REGIONS.find((r) => r.id === session.region)
  const level = levelParam || session.currentLevel
  const language = session.language || "spanish"
  const regionId = session.region || "mexico"

  const { speak, stop: stopTTS } = useTTS(language, regionId, session.voice)

  const { isRecording, toggleRecording, startRecording } = useSpeechRecognition({
    language,
    region: regionId,
    onResult: handleSpeechResult,
    onError: (err) => {
      setSpeechError(err)
      setOrbState("idle")
    },
    silenceMs: 4000,
  })

  // Sync orb to recording
  useEffect(() => {
    if (isRecording) setOrbState("listening")
  }, [isRecording])

  // Timer
  useEffect(() => {
    if (selectedTopic) {
      timerRef.current = setInterval(() => setElapsedTime((p) => p + 1), 1000)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [selectedTopic])

  const handleTopicSelect = async (topic: PracticeTopic) => {
    // Unlock audio synchronously — must call .play() before any await
    const silent = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA")
    silent.play().catch(() => {})

    setSelectedTopic(topic)
    setOrbState("thinking")

    const topicLabel = PRACTICE_TOPICS.find((t) => t.id === topic)?.label || topic
    const openingUser = language === "french"
      ? `Je voudrais pratiquer: ${topicLabel}`
      : `Quiero practicar: ${topicLabel}`

    try {
      const result = await sendMessage({
        sessionId,
        messages: [{ role: "user", content: openingUser }],
        language,
        region: regionId,
        cefrLevel: level,
        mode: "speaking",
        topic: topicLabel,
      })

      conversationHistory.current = [
        { role: "user", content: openingUser },
        { role: "assistant", content: result.aiReply },
      ]

      const aiTurn: Turn = {
        id: crypto.randomUUID(),
        speaker: "ai",
        text: result.aiReply,
        timestamp: new Date().toISOString(),
      }
      setTurns([aiTurn])

      setOrbState("speaking")
      speak(result.aiReply, () => { setOrbState("idle"); setTimeout(() => startRecording(), 600) })
    } catch (err) {
      console.error("Failed to start conversation:", err)
      setOrbState("idle")
    }
  }

  async function handleSpeechResult(transcript: string) {
    if (!transcript || isEnding) return
    setSpeechError(null)
    setOrbState("thinking")
    stopTTS()

    const userTurn: Turn = {
      id: crypto.randomUUID(),
      speaker: "user",
      text: transcript,
      timestamp: new Date().toISOString(),
    }
    setTurns((prev) => [...prev, userTurn])
    conversationHistory.current.push({ role: "user", content: transcript })

    try {
      const result = await sendMessage({
        sessionId,
        messages: conversationHistory.current,
        language,
        region: regionId,
        cefrLevel: level,
        mode: "speaking",
        topic: selectedTopic || undefined,
      })

      conversationHistory.current.push({ role: "assistant", content: result.aiReply })

      const aiTurn: Turn = {
        id: crypto.randomUUID(),
        speaker: "ai",
        text: result.aiReply,
        timestamp: new Date().toISOString(),
      }
      setTurns((prev) => [...prev, aiTurn])

      setOrbState("speaking")
      speak(result.aiReply, () => { setOrbState("idle"); setTimeout(() => startRecording(), 600) })
    } catch (err) {
      console.error("Failed to send message:", err)
      setOrbState("idle")
    }
  }

  const handleEndSession = async () => {
    if (isEnding) return
    setIsEnding(true)
    stopTTS()
    if (timerRef.current) clearInterval(timerRef.current)
    setOrbState("thinking")

    try {
      const analysis = await endSession({
        sessionId,
        transcript: turns,
        language,
        cefrLevel: level,
        mode: "speaking",
      })

      addPracticeSession({
        id: sessionId,
        mode: "speaking",
        language,
        region: regionId,
        cefrLevel: level,
        topic: selectedTopic || undefined,
        startTime: new Date(Date.now() - elapsedTime * 1000).toISOString(),
        endTime: new Date().toISOString(),
        transcript: turns,
        analysis,
        score: analysis.overallScore,
      })

      router.push(`/practice/summary?sessionId=${sessionId}&mode=speaking`)
    } catch (err) {
      console.error("Failed to end session:", err)
      router.push("/practice")
    }
  }

  if (!isHydrated) return null

  // ── Topic selection screen ──────────────────────────────────────────
  if (!selectedTopic) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="mb-8 text-center">
          <span className="text-3xl">{region?.flag}</span>
          <CefrBadge level={level} size="sm" className="mt-2" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2 text-center">What do you want to talk about?</h2>
        <p className="text-muted text-sm mb-8 text-center">Choose a topic and the AI will start the conversation</p>
        <div className="flex flex-wrap gap-3 justify-center max-w-md">
          {PRACTICE_TOPICS.map((topic) => (
            <button
              key={topic.id}
              type="button"
              onClick={() => handleTopicSelect(topic.id as PracticeTopic)}
              className="px-5 py-3 rounded-full bg-card border border-border text-foreground hover:bg-primary hover:border-primary hover:text-white transition-all text-sm font-medium"
            >
              {topic.label}
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ── Conversation screen ─────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">

      {/* Top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="text-xl">{region?.flag}</span>
          <CefrBadge level={level} size="sm" />
        </div>
        <span className="text-foreground font-mono text-sm">{formatTime(elapsedTime)}</span>
        <div className="flex items-center gap-2">
          <VoiceSelector region={regionId as import("@/lib/types").Region} />
          <Button variant="destructive" size="sm" onClick={handleEndSession} disabled={isEnding}>
            <X className="w-4 h-4 mr-1" />
            {isEnding ? "Saving..." : "End Session"}
          </Button>
        </div>
      </header>

      {/* Main — orb centered */}
      <main className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Topic pill */}
        <div className="mb-10 px-4 py-1.5 rounded-full bg-card border border-border">
          <p className="text-sm text-muted">
            {PRACTICE_TOPICS.find((t) => t.id === selectedTopic)?.label}
          </p>
        </div>

        <ConversationOrb state={orbState} />

        {speechError && (
          <p className="mt-6 text-sm text-error text-center">{speechError}</p>
        )}
      </main>

      {/* Bottom controls */}
      <footer className="px-6 pb-8 pt-4 flex flex-col items-center gap-3">
        <MicButton
          isRecording={isRecording}
          onToggle={toggleRecording}
          disabled={orbState === "thinking" || orbState === "speaking" || isEnding}
        />
        <p className="text-xs text-disabled">
          {orbState === "listening" ? "Listening · pause 4 seconds to send"
            : orbState === "idle" && !isRecording ? "Tap mic to speak"
            : ""}
        </p>
      </footer>
    </div>
  )
}

export default function SpeakingPracticePage() {
  return (
    <Suspense fallback={null}>
      <SpeakingContent />
    </Suspense>
  )
}
