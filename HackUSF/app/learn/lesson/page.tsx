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
import { useStore } from "@/lib/store"
import { startLesson, sendMessage, endSession } from "@/lib/api"
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
  // Brief scenario label shown at top
  const [showScenarioLabel, setShowScenarioLabel] = useState(true)

  const conversationHistory = useRef<{ role: "user" | "assistant"; content: string }[]>([])

  const scenario = SCENARIOS.find((s) => s.id === scenarioId)
  const scenarioContext = SCENARIO_CONTEXTS[scenarioId] || { context: "", goal: "" }
  const region = REGIONS.find((r) => r.id === session.region)
  const language = session.language || "spanish"
  const regionId = session.region || "mexico"

  const { speak, stop: stopTTS } = useTTS(language, regionId)

  const { isRecording, toggleRecording } = useSpeechRecognition({
    language,
    region: regionId,
    onResult: handleSpeechResult,
    onError: (err) => {
      setSpeechError(err)
      setOrbState("idle")
    },
    silenceMs: 2000,
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

  // Init lesson on mount
  useEffect(() => {
    if (isHydrated && session.language && session.region && scenarioId) {
      initLesson()
    }
  }, [isHydrated, session.language, session.region, scenarioId])

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
      speak(result.aiMessage, () => setOrbState("idle"))
    } catch (err) {
      console.error("Failed to start lesson:", err)
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
      speak(result.aiReply, () => setOrbState("idle"))
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

  const hints = [
    `Try greeting with "${language === "french" ? "Bonjour / Bonsoir" : "Hola / Buenas tardes"}"`,
    `Use "${language === "french" ? "Je voudrais..." : "Me gustaría..."}" for requests`,
    `Don't forget "${language === "french" ? "s'il vous plaît" : "por favor"}"!`,
  ]

  if (!isHydrated || !scenario) return null

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

        {/* Right: stars + end */}
        <div className="flex items-center gap-3">
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
          {orbState === "idle"
            ? isRecording ? "" : "Tap mic · speak · pause to send"
            : orbState === "listening" ? "Pause for 2 seconds to send automatically"
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
