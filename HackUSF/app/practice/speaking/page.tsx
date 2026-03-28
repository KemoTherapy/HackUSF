"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CefrBadge } from "@/components/ui/cefr-badge"
import { MicButton } from "@/components/ui/mic-button"
import { AudioWaveform } from "@/components/ui/audio-waveform"
import { ChatBubble } from "@/components/lesson/chat-bubble"
import { REGIONS, PRACTICE_TOPICS } from "@/lib/constants"
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
  const [messages, setMessages] = useState<Turn[]>([])
  const [selectedTopic, setSelectedTopic] = useState<PracticeTopic | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [streamingText, setStreamingText] = useState("")
  const [elapsedTime, setElapsedTime] = useState(0)
  const [speechError, setSpeechError] = useState<string | null>(null)

  const chatContainerRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const conversationHistory = useRef<{ role: "user" | "assistant"; content: string }[]>([])

  const region = REGIONS.find((r) => r.id === session.region)
  const level = levelParam || session.currentLevel
  const language = session.language || "spanish"
  const regionId = session.region || "mexico"

  const { speak } = useTTS(language, regionId)

  const { isRecording, toggleRecording } = useSpeechRecognition({
    language,
    region: regionId,
    onResult: handleSpeechResult,
    onError: (err) => setSpeechError(err),
  })

  // Timer
  useEffect(() => {
    if (selectedTopic) {
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1)
      }, 1000)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [selectedTopic])

  // Scroll to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages, streamingText])

  const handleTopicSelect = async (topic: PracticeTopic) => {
    setSelectedTopic(topic)
    setIsLoading(true)

    const topicLabel = PRACTICE_TOPICS.find((t) => t.id === topic)?.label || topic

    // Opening user message to seed the conversation
    const openingUser = language === "french"
      ? `Je voudrais pratiquer: ${topicLabel}`
      : `Quiero practicar: ${topicLabel}`

    let aiText = ""
    setStreamingText("")

    try {
      const result = await sendMessage({
        sessionId,
        messages: [{ role: "user", content: openingUser }],
        language,
        region: regionId,
        cefrLevel: level,
        mode: "speaking",
        topic: topicLabel,
        onChunk: (chunk) => {
          aiText += chunk
          setStreamingText(aiText)
        },
      })

      conversationHistory.current = [
        { role: "user", content: openingUser },
        { role: "assistant", content: result.aiReply },
      ]

      const aiMessage: Turn = {
        id: crypto.randomUUID(),
        speaker: "ai",
        text: result.aiReply,
        timestamp: new Date().toISOString(),
      }
      setMessages([aiMessage])
      setStreamingText("")
      speak(result.aiReply)
    } catch (error) {
      console.error("Failed to start conversation:", error)
      setStreamingText("")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSpeechResult(transcript: string) {
    if (!transcript || isLoading) return

    setSpeechError(null)
    setIsLoading(true)

    const userMessage: Turn = {
      id: crypto.randomUUID(),
      speaker: "user",
      text: transcript,
      timestamp: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMessage])
    conversationHistory.current.push({ role: "user", content: transcript })

    let aiText = ""
    setStreamingText("")

    try {
      const result = await sendMessage({
        sessionId,
        messages: conversationHistory.current,
        language,
        region: regionId,
        cefrLevel: level,
        mode: "speaking",
        topic: selectedTopic || undefined,
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

  const handleEndSession = async () => {
    if (timerRef.current) clearInterval(timerRef.current)

    setIsLoading(true)
    try {
      const analysis = await endSession({
        sessionId,
        transcript: messages,
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
        transcript: messages,
        analysis,
        score: analysis.overallScore,
      })

      router.push(`/practice/summary?sessionId=${sessionId}&mode=speaking`)
    } catch (error) {
      console.error("Failed to end session:", error)
      router.push("/practice")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isHydrated) return null

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="text-lg">{region?.flag}</span>
            <CefrBadge level={level} size="sm" />
          </div>
          <span className="text-foreground font-mono">{formatTime(elapsedTime)}</span>
          <Button variant="destructive" size="sm" onClick={handleEndSession} disabled={isLoading}>
            <X className="w-4 h-4 mr-1" />
            End Session
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topic selection */}
        {!selectedTopic ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="w-full max-w-lg bg-card rounded-2xl p-6 card-shadow">
              <h2 className="text-lg font-semibold text-foreground mb-4 text-center">
                What do you want to talk about?
              </h2>
              <div className="flex flex-wrap gap-2 justify-center">
                {PRACTICE_TOPICS.map((topic) => (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => handleTopicSelect(topic.id as PracticeTopic)}
                    className="px-4 py-2 rounded-full bg-background-elevated text-foreground hover:bg-primary hover:text-white transition-colors"
                  >
                    {topic.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Chat area */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <ChatBubble
                  key={message.id}
                  speaker={message.speaker}
                  text={message.text}
                  flag={region?.flag}
                  onSpeak={message.speaker === "ai" ? () => speak(message.text) : undefined}
                />
              ))}

              {streamingText && (
                <ChatBubble speaker="ai" text={streamingText} flag={region?.flag} isStreaming />
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
              <div className="flex flex-col items-center gap-2">
                <MicButton isRecording={isRecording} onToggle={toggleRecording} disabled={isLoading} />
                <span className="text-sm text-muted">
                  {isRecording ? "Recording... tap to stop" : "Tap to speak"}
                </span>
              </div>
            </div>
          </>
        )}
      </main>
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
