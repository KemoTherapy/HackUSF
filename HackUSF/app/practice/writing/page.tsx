"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { X, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CefrBadge } from "@/components/ui/cefr-badge"
import { WritingExercise } from "@/components/practice/writing-exercise"
import { REGIONS } from "@/lib/constants"
import { useStore } from "@/lib/store"
import { getWritingExercises } from "@/lib/api"
import type { WritingExercise as WritingExerciseType, CefrLevel } from "@/lib/types"

function WritingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const levelParam = searchParams.get("level") as CefrLevel | null
  const { session, isHydrated, addPracticeSession } = useStore()

  const [sessionId] = useState(() => crypto.randomUUID())
  const [exercises, setExercises] = useState<WritingExerciseType[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const region = REGIONS.find((r) => r.id === session.region)
  const level = levelParam || session.currentLevel

  // Fetch exercises
  useEffect(() => {
    if (isHydrated && session.language && session.region) {
      loadExercises()
    }
  }, [isHydrated, session.language, session.region])

  const loadExercises = async () => {
    try {
      const result = await getWritingExercises({
        language: session.language!,
        region: session.region!,
        cefrLevel: level,
      })
      setExercises(result)
    } catch (error) {
      console.error("Failed to load exercises:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExerciseComplete = (correct: boolean) => {
    if (correct) {
      setCorrectCount((prev) => prev + 1)
    }
  }

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      setIsComplete(true)
    }
  }

  const handleEndSession = () => {
    const score = Math.round((correctCount / exercises.length) * 100)

    addPracticeSession({
      id: sessionId,
      mode: "writing",
      language: session.language || "spanish",
      region: session.region || "mexico",
      cefrLevel: level,
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      score,
    })

    router.push(`/practice/summary?sessionId=${sessionId}&mode=writing`)
  }

  if (!isHydrated || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted">Loading exercises...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
        {/* Progress bar */}
        <div className="h-1 bg-border">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / exercises.length) * 100}%` }}
          />
        </div>

        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <CefrBadge level={level} size="sm" />
            <span className="text-lg">{region?.flag}</span>
          </div>
          <span className="text-sm text-muted">
            Exercise {currentIndex + 1} of {exercises.length}
          </span>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleEndSession}
          >
            <X className="w-4 h-4 mr-1" />
            End
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-start justify-center p-6 pb-32">
        <div className="w-full max-w-2xl">
          {!isComplete && exercises[currentIndex] && (
            <>
              <WritingExercise
                key={exercises[currentIndex].id}
                exercise={exercises[currentIndex]}
                language={session.language || "spanish"}
                onComplete={handleExerciseComplete}
              />

              {/* Next button (appears after answer) */}
              <div className="mt-6 flex justify-end">
                <Button
                  onClick={handleNext}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  {currentIndex < exercises.length - 1 ? (
                    <>
                      Next Exercise
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    "See Results"
                  )}
                </Button>
              </div>
            </>
          )}

          {isComplete && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Practice Complete!
              </h2>
              <p className="text-xl text-muted mb-8">
                You got <span className="text-success font-semibold">{correctCount}</span> out of{" "}
                <span className="font-semibold">{exercises.length}</span> correct
              </p>
              <Button
                onClick={handleEndSession}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                View Summary
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default function WritingPracticePage() {
  return (
    <Suspense fallback={null}>
      <WritingContent />
    </Suspense>
  )
}
