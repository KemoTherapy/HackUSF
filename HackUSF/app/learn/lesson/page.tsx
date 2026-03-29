"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Lightbulb, X, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MicButton } from "@/components/ui/mic-button"
import { StarRating } from "@/components/ui/star-rating"
import { PhraseBank } from "@/components/lesson/phrase-bank"
import { HintPanel } from "@/components/lesson/hint-panel"
import { ConversationOrb, type OrbState } from "@/components/conversation/ConversationOrb"
import { SCENARIOS, SCENARIO_CONTEXTS, KEY_PHRASES, REGIONS } from "@/lib/constants"
import { VoiceSelector } from "@/components/ui/voice-selector"
import { useStore } from "@/lib/store"
import { startLesson, sendMessage, endSession } from "@/lib/api"
import { SuggestionChips } from "@/components/lesson/SuggestionChips"
import { useSpeechRecognition } from "@/hooks/use-speech-recognition"
import { useTTS } from "@/hooks/use-tts"
import type { Turn, Scenario, Phrase } from "@/lib/types"
import { scoreToStars } from "@/lib/utils"

function LessonContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const scenarioId = searchParams.get("scenario") as Scenario
  const { session, isHydrated, updateLevelProgress, addPracticeSession } = useStore()

  const [sessionId, setSessionId] = useState<string | null>(null)
  const [turns, setTurns] = useState<Turn[]>([])
  const [keyPhrases, setKeyPhrases] = useState<Phrase[]>([])
  const [orbState, setOrbState] = useState<OrbState>("idle")
  const [showHints, setShowHints] = useState(false)
  const [showPhrases, setShowPhrases] = useState(false)
  const [currentScore, setCurrentScore] = useState(0)
  const [step, setStep] = useState(1)
  const [speechError, setSpeechError] = useState<string | null>(null)
  const [isEnding, setIsEnding] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  // Brief scenario label shown at top
  const [showScenarioLabel, setShowScenarioLabel] = useState(true)

  const conversationHistory = useRef<{ role: "user" | "assistant"; content: string }[]>([])
  const suggestionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const scenario = SCENARIOS.find((s) => s.id === scenarioId)
  const scenarioContext = SCENARIO_CONTEXTS[scenarioId] || { context: "", goal: "" }
  const region = REGIONS.find((r) => r.id === session.region)
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

  // Sync orb to recording state
  useEffect(() => {
    if (isRecording) setOrbState("listening")
  }, [isRecording])

  // Hide scenario label after 4s
  useEffect(() => {
    const t = setTimeout(() => setShowScenarioLabel(false), 4000)
    return () => clearTimeout(t)
  }, [])

  // Lesson starts only after user taps "Begin" (required for browser audio autoplay policy)

  const initLesson = async () => {
    try {
      const result = await startLesson({
        language: session.language!,
        region: session.region!,
        cefrLevel: session.currentLevel,
        scenario: scenarioId,
      })
      setSessionId(result.sessionId)
      setKeyPhrases(result.keyPhrases)

      const firstTurn: Turn = {
        id: crypto.randomUUID(),
        speaker: "ai",
        text: result.aiMessage,
        timestamp: new Date().toISOString(),
      }
      setTurns([firstTurn])
      conversationHistory.current = [{ role: "assistant", content: result.aiMessage }]

      // Speak opening line
      setOrbState("speaking")
      fetchSuggestions()
      speak(result.aiMessage, () => {
        setOrbState("idle")
        setTimeout(() => { startRecording(); startSuggestionTimer() }, 600)
      })
    } catch (err) {
      console.error("Failed to start lesson:", err)
      setOrbState("idle")
    }
  }

  async function handleSpeechResult(transcript: string) {
    if (!transcript || isEnding) return
    clearSuggestions()
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
    setCurrentScore((prev) => Math.min(100, prev + Math.floor(Math.random() * 10) + 8))
    setStep((prev) => prev + 1)

    try {
      const result = await sendMessage({
        sessionId: sessionId!,
        messages: conversationHistory.current,
        language: session.language!,
        region: session.region!,
        cefrLevel: session.currentLevel,
        mode: "lesson",
        scenario: scenarioId,
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
      if (result.lessonComplete) {
        // AI has signalled the scenario is done — end after the farewell finishes speaking
        speak(result.aiReply, () => handleEndLesson())
      } else {
        fetchSuggestions()
        speak(result.aiReply, () => {
          setOrbState("idle")
          setTimeout(() => { startRecording(); startSuggestionTimer() }, 600)
        })
      }
    } catch (err) {
      console.error("Failed to send message:", err)
      setOrbState("idle")
    }
  }

  const handleEndLesson = async () => {
    if (!sessionId || isEnding) return
    setIsEnding(true)
    stopTTS()
    setOrbState("thinking")

    try {
      const analysis = await endSession({
        sessionId,
        transcript: turns,
        language: session.language!,
        cefrLevel: session.currentLevel,
        scenario: scenarioId,
        mode: "lesson",
      })

      addPracticeSession({
        id: sessionId,
        mode: "lesson",
        language: session.language!,
        region: session.region!,
        cefrLevel: session.currentLevel,
        scenario: scenarioId,
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        transcript: turns,
        analysis,
        starsEarned: analysis.starsEarned,
        score: analysis.overallScore,
      })

      updateLevelProgress(session.currentLevel, analysis.starsEarned, scenarioId)
      router.push(`/learn/summary?sessionId=${sessionId}`)
    } catch (err) {
      console.error("Failed to end session:", err)
      router.push("/learn/scenarios")
    }
  }

  const fetchSuggestions = async () => {
    try {
      const res = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: conversationHistory.current,
          language,
          cefrLevel: session.currentLevel,
        }),
      })
      const data = await res.json()
      setSuggestions(data.suggestions ?? [])
    } catch {
      setSuggestions([])
    }
  }

  const startSuggestionTimer = () => {
    if (suggestionTimerRef.current) clearTimeout(suggestionTimerRef.current)
    setShowSuggestions(false)
    suggestionTimerRef.current = setTimeout(() => setShowSuggestions(true), 3000)
  }

  const clearSuggestions = () => {
    if (suggestionTimerRef.current) clearTimeout(suggestionTimerRef.current)
    setShowSuggestions(false)
    setSuggestions([])
  }

  const handleSuggestionSelect = (text: string) => {
    clearSuggestions()
    handleSpeechResult(text)
  }

  // Called when user taps "Begin" — unlock browser audio synchronously within the gesture
  const handleBegin = async () => {
    // Must call .play() synchronously (no await before it) so Chrome registers
    // the user gesture and unlocks audio for the entire tab session.
    const silent = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA")
    silent.play().catch(() => {})  // fire-and-forget — Chrome only checks that play() was called

    setHasStarted(true)
    setOrbState("thinking")
    await initLesson()
  }

  const hints = [
    `Try greeting with "${language === "french" ? "Bonjour / Bonsoir" : "Hola / Buenas tardes"}"`,
    `Use "${language === "french" ? "Je voudrais..." : "Me gustaría..."}" for requests`,
    `Don't forget "${language === "french" ? "s'il vous plaît" : "por favor"}"!`,
  ]

  if (!isHydrated || !scenario) return null

  // ── Tap-to-begin screen ─────────────────────────────────────────────
  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center">
        <div className="mb-4 text-4xl">{region?.flag}</div>
        <p className="text-xs text-muted uppercase tracking-widest mb-2">{scenario.icon} {scenario.name}</p>
        <h1 className="text-2xl font-bold text-foreground mb-1">{scenarioContext.context}</h1>
        <p className="text-sm text-muted mb-10 max-w-xs">{scenarioContext.goal}</p>
        <button
          type="button"
          onClick={handleBegin}
          className="px-8 py-4 rounded-2xl bg-primary text-white font-semibold text-lg hover:bg-primary/90 active:scale-95 transition-all"
        >
          Begin Lesson
        </button>
        <p className="text-xs text-disabled mt-4">Tap to start · audio will play automatically</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">

      {/* Top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-5 py-4">
        {/* Left: scenario + region */}
        <div className="flex items-center gap-3">
          <span className="text-xl">{region?.flag}</span>
          <div>
            <p className="text-xs text-muted uppercase tracking-wider">{scenario.icon} {scenario.name}</p>
            <p className="text-xs text-disabled">{session.currentLevel}</p>
          </div>
        </div>

        {/* Right: voice selector + stars + end */}
        <div className="flex items-center gap-3">
          <VoiceSelector region={regionId as import("@/lib/types").Region} />
          <StarRating earned={scoreToStars(currentScore)} size="sm" />
          <Button
            variant="destructive"
            size="sm"
            onClick={handleEndLesson}
            disabled={isEnding}
          >
            <X className="w-4 h-4 mr-1" />
            {isEnding ? "Saving..." : "End"}
          </Button>
        </div>
      </header>

      {/* Step progress bar */}
      <div className="h-0.5 bg-border mx-5 rounded-full">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${Math.min(100, (step / 8) * 100)}%` }}
        />
      </div>

      {/* Main — orb centered */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 gap-10">

        {/* Scenario context — fades after 4s */}
        <div
          className="text-center transition-all duration-700 max-w-sm"
          style={{ opacity: showScenarioLabel ? 1 : 0, transform: showScenarioLabel ? "translateY(0)" : "translateY(-10px)" }}
        >
          <p className="text-sm text-muted">{scenarioContext.context}</p>
          <p className="text-xs text-disabled mt-1">{scenarioContext.goal}</p>
        </div>

        {/* The orb */}
        <ConversationOrb state={orbState} />

        <SuggestionChips
          suggestions={suggestions}
          visible={showSuggestions}
          onSelect={handleSuggestionSelect}
        />

        {/* Error */}
        {speechError && (
          <p className="text-sm text-error text-center">{speechError}</p>
        )}
      </main>

      {/* Bottom controls */}
      <footer className="px-6 pb-8 pt-4 flex flex-col items-center gap-4">
        <div className="flex items-center gap-6">
          {/* Hints */}
          <button
            type="button"
            onClick={() => setShowHints(true)}
            className="flex flex-col items-center gap-1 text-muted hover:text-foreground transition-colors"
          >
            <div className="w-11 h-11 rounded-full bg-card flex items-center justify-center">
              <Lightbulb className="w-5 h-5" />
            </div>
            <span className="text-xs">Hints</span>
          </button>

          {/* Mic button */}
          <MicButton
            isRecording={isRecording}
            onToggle={toggleRecording}
            disabled={orbState === "thinking" || orbState === "speaking" || isEnding}
          />

          {/* Phrases */}
          <button
            type="button"
            onClick={() => setShowPhrases(true)}
            className="flex flex-col items-center gap-1 text-muted hover:text-foreground transition-colors"
          >
            <div className="w-11 h-11 rounded-full bg-card flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-xs">Phrases</span>
          </button>
        </div>

        <p className="text-xs text-disabled">
          {orbState === "listening" ? "Listening · pause 4 seconds to send"
            : orbState === "idle" && !isRecording ? "Tap mic to speak"
            : ""}
        </p>
      </footer>

      {/* Hints panel */}
      <HintPanel hints={hints} isOpen={showHints} onClose={() => setShowHints(false)} />

      {/* Phrases overlay */}
      {showPhrases && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-end"
          onClick={() => setShowPhrases(false)}
        >
          <div
            className="w-full bg-card rounded-t-2xl p-6 max-h-[60vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-foreground">Useful Phrases</h3>
              <button
                type="button"
                onClick={() => setShowPhrases(false)}
                className="text-muted hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <PhraseBank
              phrases={keyPhrases.length > 0 ? keyPhrases : KEY_PHRASES[session.currentLevel]?.[scenarioId] || []}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default function LessonPage() {
  return (
    <Suspense fallback={null}>
      <LessonContent />
    </Suspense>
  )
}
