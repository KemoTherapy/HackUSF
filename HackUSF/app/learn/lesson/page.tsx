"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Lightbulb, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StarRating } from "@/components/ui/star-rating"
import { MicButton } from "@/components/ui/mic-button"
import { AudioWaveform } from "@/components/ui/audio-waveform"
import { ScenarioIntro } from "@/components/lesson/scenario-intro"
import { PhraseBank } from "@/components/lesson/phrase-bank"
import { ChatBubble } from "@/components/lesson/chat-bubble"
import { HintPanel } from "@/components/lesson/hint-panel"
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
  const [messages, setMessages] = useState<Turn[]>([])
  const [keyPhrases, setKeyPhrases] = useState<Phrase[]>([])
  const [showHints, setShowHints] = useState(false)
  const [currentScore, setCurrentScore] = useState(0)
  const [step, setStep] = useState(1)
  const [showIntro, setShowIntro] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [streamingText, setStreamingText] = useState("")
  const [speechError, setSpeechError] = useState<string | null>(null)

  const chatContainerRef = useRef<HTMLDivElement>(null)
  // Build message history for Claude: exclude the very first AI greeting (it was sent as system open)
  const conversationHistory = useRef<{ role: "user" | "assistant"; content: string }[]>([])

  const scenario = SCENARIOS.find((s) => s.id === scenarioId)
  const scenarioContext = SCENARIO_CONTEXTS[scenarioId] || { context: "", goal: "" }
  const region = REGIONS.find((r) => r.id === session.region)

  const { speak } = useTTS(session.language || "spanish", session.region || "mexico")

  const { isRecording, toggleRecording } = useSpeechRecognition({
    language: session.language || "spanish",
    region: session.region || "mexico",
    onResult: handleSpeechResult,
    onError: (err) => setSpeechError(err),
  })

  // Initialize lesson
  useEffect(() => {
    if (isHydrated && session.language && session.region && scenarioId) {
      initLesson()
    }
  }, [isHydrated, session.language, session.region, scenarioId])

  // Scroll to bottom on new messages or streaming
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages, streamingText])

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

      const firstMessage: Turn = {
        id: crypto.randomUUID(),
        speaker: "ai",
        text: result.aiMessage,
        timestamp: new Date().toISOString(),
      }
      setMessages([firstMessage])
      // Seed conversation history with AI's opening
      conversationHistory.current = [{ role: "assistant", content: result.aiMessage }]
      // Speak the opening
      speak(result.aiMessage)
    } catch (error) {
      console.error("Failed to start lesson:", error)
    }
  }

  async function handleSpeechResult(transcript: string) {
    if (!transcript || isLoading) return

    setSpeechError(null)
    setIsLoading(true)
    setShowIntro(false)

    const userMessage: Turn = {
      id: crypto.randomUUID(),
      speaker: "user",
      text: transcript,
      timestamp: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMessage])

    // Add to history
    conversationHistory.current.push({ role: "user", content: transcript })

    // Score update: each turn adds points
    setCurrentScore((prev) => Math.min(100, prev + Math.floor(Math.random() * 10) + 8))
    setStep((prev) => prev + 1)

    let aiText = ""
    setStreamingText("")

    try {
      const result = await sendMessage({
        sessionId: sessionId!,
        messages: conversationHistory.current,
        language: session.language!,
        region: session.region!,
        cefrLevel: session.currentLevel,
        mode: "lesson",
        scenario: scenarioId,
        onChunk: (chunk) => {
          aiText += chunk
          setStreamingText(aiText)
        },
      })

      conversationHistory.current.push({ role: "assistant", content: result.aiReply })

      const aiMessage: Turn = {
        id: crypto.randomUUID(),
        speaker: "ai",
        text: result.aiReply,
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setStreamingText("")
      speak(result.aiReply)
    } catch (error) {
      console.error("Failed to send message:", error)
      setStreamingText("")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEndLesson = async () => {
    if (!sessionId) {
      router.push("/learn/scenarios")
      return
    }

    setIsLoading(true)
    try {
      const analysis = await endSession({
        sessionId,
        transcript: messages,
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
        transcript: messages,
        analysis,
        starsEarned: analysis.starsEarned,
        score: analysis.overallScore,
      })

      updateLevelProgress(session.currentLevel, analysis.starsEarned, scenarioId)
      router.push(`/learn/summary?sessionId=${sessionId}`)
    } catch (error) {
      console.error("Failed to end session:", error)
      router.push("/learn/scenarios")
    } finally {
      setIsLoading(false)
    }
  }

  const hints = [
    `Try greeting with "${session.language === "french" ? "Bonjour, bonsoir" : "Hola, buenas tardes"}"`,
    `Use "${session.language === "french" ? "Je voudrais..." : "Me gustaría..."}" for requests`,
    `Don't forget "${session.language === "french" ? "s'il vous plaît" : "por favor"}"!`,
  ]

  if (!isHydrated || !scenario) return null

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="h-1 bg-border">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(step / 8) * 100}%` }}
          />
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="font-semibold text-foreground">{scenario.name}</h1>
          <div className="flex items-center gap-4">
            <StarRating earned={scoreToStars(currentScore)} size="sm" />
            <Button variant="destructive" size="sm" onClick={handleEndLesson} disabled={isLoading}>
              <X className="w-4 h-4 mr-1" />
              End
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Phrases panel */}
        <aside className="w-full md:w-80 shrink-0 border-b md:border-b-0 md:border-r border-border p-4 overflow-y-auto">
          <PhraseBank phrases={keyPhrases.length > 0 ? keyPhrases : KEY_PHRASES[session.currentLevel]?.[scenarioId] || []} />
        </aside>

        {/* Chat area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {showIntro && (
              <ScenarioIntro
                context={scenarioContext.context}
                goal={scenarioContext.goal}
                className="mb-4"
              />
            )}

            {messages.map((message) => (
              <ChatBubble
                key={message.id}
                speaker={message.speaker}
                text={message.text}
                translation={message.translation}
                flag={region?.flag}
                onSpeak={message.speaker === "ai" ? () => speak(message.text) : undefined}
              />
            ))}

            {/* Streaming AI response */}
            {streamingText && (
              <ChatBubble
                speaker="ai"
                text={streamingText}
                flag={region?.flag}
                isStreaming
              />
            )}

            {isLoading && !streamingText && (
              <div className="flex items-center gap-2 text-muted">
                <div className="w-2 h-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            )}
          </div>

          {/* Input bar */}
          <div className="border-t border-border p-4 bg-card">
            {speechError && (
              <p className="text-center text-sm text-error mb-2">{speechError}</p>
            )}
            {isRecording && (
              <div className="flex justify-center mb-4">
                <AudioWaveform isActive={isRecording} />
              </div>
            )}

            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowHints(true)}
                className="shrink-0"
              >
                <Lightbulb className="w-5 h-5" />
              </Button>

              <div className="flex flex-col items-center gap-2">
                <MicButton
                  isRecording={isRecording}
                  onToggle={toggleRecording}
                  disabled={isLoading}
                />
                <span className="text-sm text-muted">
                  {isRecording ? "Recording... tap to stop" : "Tap to speak"}
                </span>
              </div>

              <div className="w-10" />
            </div>
          </div>
        </main>
      </div>

      <HintPanel hints={hints} isOpen={showHints} onClose={() => setShowHints(false)} />
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
