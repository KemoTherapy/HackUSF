"use client"

import { useState } from "react"
import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { checkAnswer } from "@/lib/api"
import type { WritingExercise as WritingExerciseType, Language } from "@/lib/types"

interface WritingExerciseProps {
  exercise: WritingExerciseType
  language: Language
  onComplete: (correct: boolean) => void
  className?: string
}

export function WritingExercise({ exercise, language, onComplete, className }: WritingExerciseProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [userInput, setUserInput] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isChecking, setIsChecking] = useState(false)

  const handleSubmit = async () => {
    setIsChecking(true)
    try {
      const userAnswer = exercise.type === "translation" ? userInput.trim() : selectedAnswer || ""
      const result = await checkAnswer({
        exerciseType: exercise.type,
        userAnswer,
        correctAnswer: exercise.answer,
        prompt: exercise.prompt,
        language,
      })
      setIsCorrect(result.correct)
      setFeedback(result.explanation)
      setIsSubmitted(true)
      onComplete(result.correct)
    } catch {
      // Fallback to local check
      const userAnswer = exercise.type === "translation" ? userInput.trim() : selectedAnswer || ""
      const correct = userAnswer.toLowerCase().replace(/[.,!?]/g, "") === exercise.answer.toLowerCase().replace(/[.,!?]/g, "")
      setIsCorrect(correct)
      setFeedback(exercise.explanation)
      setIsSubmitted(true)
      onComplete(correct)
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <div className={cn("bg-card rounded-2xl p-6", className)}>
      {/* Passage for comprehension */}
      {exercise.passage && (
        <div className="mb-6 p-4 rounded-xl bg-background-elevated">
          <p className="text-sm text-muted mb-2">Read the following:</p>
          <p className="text-foreground leading-relaxed italic">
            &ldquo;{exercise.passage}&rdquo;
          </p>
        </div>
      )}

      {/* Prompt */}
      <p className="text-foreground font-medium mb-4">{exercise.prompt}</p>

      {/* Answer options */}
      {exercise.type !== "translation" && exercise.options && (
        <div className="space-y-2 mb-6">
          {exercise.options.map((option, index) => {
            const letter = String.fromCharCode(65 + index) // A, B, C...
            const isSelected = selectedAnswer === option
            const showResult = isSubmitted
            const isCorrectOption = option === exercise.answer

            return (
              <button
                key={option}
                type="button"
                onClick={() => !isSubmitted && setSelectedAnswer(option)}
                disabled={isSubmitted}
                className={cn(
                  "w-full flex items-center gap-3 p-4 rounded-xl transition-all text-left",
                  !isSubmitted && !isSelected && "bg-background-elevated hover:bg-border",
                  !isSubmitted && isSelected && "bg-primary/20 border-2 border-primary",
                  showResult && isCorrectOption && "bg-success/20 border-2 border-success",
                  showResult && isSelected && !isCorrectOption && "bg-error/20 border-2 border-error",
                )}
              >
                <span
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                    !showResult && "bg-border text-muted",
                    showResult && isCorrectOption && "bg-success text-white",
                    showResult && isSelected && !isCorrectOption && "bg-error text-white",
                  )}
                >
                  {showResult && isCorrectOption ? (
                    <Check className="w-4 h-4" />
                  ) : showResult && isSelected && !isCorrectOption ? (
                    <X className="w-4 h-4" />
                  ) : (
                    letter
                  )}
                </span>
                <span className="text-foreground">{option}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* Translation input */}
      {exercise.type === "translation" && (
        <div className="mb-6">
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={isSubmitted}
            placeholder="Type your translation..."
            className="w-full p-4 rounded-xl bg-background-elevated border border-border text-foreground placeholder:text-disabled resize-none h-24 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      )}

      {/* Result message */}
      {isSubmitted && feedback && (
        <div className={cn("p-4 rounded-xl mb-6", isCorrect ? "bg-success/20" : "bg-error/20")}>
          <div className="flex items-start gap-3">
            <div className={cn("w-6 h-6 rounded-full flex items-center justify-center shrink-0", isCorrect ? "bg-success" : "bg-error")}>
              {isCorrect ? <Check className="w-4 h-4 text-white" /> : <X className="w-4 h-4 text-white" />}
            </div>
            <div>
              <p className={cn("font-medium", isCorrect ? "text-success" : "text-error")}>
                {isCorrect ? "Correct!" : "Not quite..."}
              </p>
              {!isCorrect && (
                <p className="text-muted text-sm mt-1">
                  Correct answer: <span className="text-success font-medium">{exercise.answer}</span>
                </p>
              )}
              <p className="text-muted text-sm mt-2">{feedback}</p>
            </div>
          </div>
        </div>
      )}

      {/* Submit button */}
      {!isSubmitted && (
        <Button
          onClick={handleSubmit}
          disabled={(!selectedAnswer && !userInput.trim()) || isChecking}
          className="w-full bg-primary hover:bg-primary/90 text-white"
        >
          {isChecking ? "Checking..." : "Check Answer"}
        </Button>
      )}
    </div>
  )
}
