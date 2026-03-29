"use client"

import { Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, Mic, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnalysisSummary } from "@/components/analysis/analysis-summary"
import { FeedbackCategory } from "@/components/analysis/feedback-category"
import { ConversationTranscript } from "@/components/conversation/ConversationTranscript"
import { useStore } from "@/lib/store"
import { REGIONS } from "@/lib/constants"
import type { AnalysisReport, Correction, PracticeMode } from "@/lib/types"

// Mock analysis for demo
const mockAnalysis: AnalysisReport = {
  overallScore: 78,
  starsEarned: 4,
  categories: {
    pronunciation: { score: 75, notes: ["Good intonation"] },
    grammar: { score: 80, notes: ["Correct verb usage"] },
    vocabulary: { score: 82, notes: ["Good word variety"] },
    fluency: { score: 72, notes: ["Some pauses"] },
    naturalness: { score: 78, notes: ["Natural phrasing"] },
    confidence: { score: 80, notes: ["Good confidence"] },
  },
  strengths: ["Good vocabulary", "Clear pronunciation"],
  weaknesses: ["Verb tense consistency"],
  corrections: [
    {
      original: "Yo soy de España",
      corrected: "Soy de España",
      explanation: "The pronoun 'yo' is often omitted in Spanish",
      type: "naturalness",
    },
  ],
  nextSteps: ["Practice more conversational Spanish", "Work on fluency"],
}

function SummaryContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("sessionId")
  const mode = searchParams.get("mode") as PracticeMode | null
  const { session, isHydrated } = useStore()

  const practiceSession = session.sessions.find((s) => s.id === sessionId)
  const analysis = practiceSession?.analysis || mockAnalysis
  const score = practiceSession?.score || analysis.overallScore
  const transcript = practiceSession?.transcript || []
  const regionData = REGIONS.find((r) => r.id === practiceSession?.region)

  // Group corrections by type
  const grammarCorrections = analysis.corrections.filter((c: Correction) => c.type === "grammar")
  const vocabCorrections = analysis.corrections.filter((c: Correction) => c.type === "vocabulary")
  const naturalCorrections = analysis.corrections.filter((c: Correction) => c.type === "naturalness")

  if (!isHydrated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-[800px] mx-auto px-6 py-4">
          <Link
            href="/practice"
            className="inline-flex items-center gap-2 text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Back to Practice</span>
          </Link>
        </div>
      </header>

      <main className="max-w-[800px] mx-auto px-6 py-8 pb-32">
        {/* Header section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card mb-4">
            {mode === "speaking" ? (
              <Mic className="w-5 h-5 text-primary" />
            ) : (
              <BookOpen className="w-5 h-5 text-tertiary" />
            )}
            <span className="text-foreground font-medium capitalize">{mode} Practice</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Practice Complete
          </h1>

          <p className="text-xl text-muted">
            {mode === "writing" ? (
              <>
                Score: <span className="text-foreground font-semibold">{score}%</span> correct
              </>
            ) : (
              <>
                Score: <span className="text-foreground font-semibold">{score}</span> / 100
              </>
            )}
          </p>
        </div>

        {/* Analysis sections (for speaking) */}
        {mode === "speaking" && (
          <div className="space-y-6">
            <AnalysisSummary analysis={analysis} />

            {transcript.length > 0 && (
              <ConversationTranscript
                turns={transcript}
                corrections={analysis.corrections}
                flag={regionData?.flag}
              />
            )}

            <div className="space-y-4">
              <h3 className="font-semibold text-foreground px-2">Key Feedback</h3>
              <FeedbackCategory title="Grammar" corrections={grammarCorrections} />
              <FeedbackCategory title="Vocabulary" corrections={vocabCorrections} />
              <FeedbackCategory title="Naturalness" corrections={naturalCorrections} />
            </div>
          </div>
        )}

        {/* Writing summary */}
        {mode === "writing" && (
          <div className="bg-card rounded-2xl p-6">
            <h3 className="font-semibold text-foreground mb-4">Session Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <span className="text-muted">Exercises Completed</span>
                <span className="text-foreground font-medium">5</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border">
                <span className="text-muted">Correct Answers</span>
                <span className="text-success font-medium">{Math.round((score / 100) * 5)}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-muted">Accuracy</span>
                <span className="text-foreground font-medium">{score}%</span>
              </div>
            </div>
          </div>
        )}

        {/* CTA buttons */}
        <div className="mt-12 flex flex-col md:flex-row gap-4">
          <Button
            asChild
            className="flex-1 bg-primary hover:bg-primary/90 text-white py-6 text-lg"
          >
            <Link href="/practice">Practice Again</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="flex-1 py-6 text-lg"
          >
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="flex-1 py-6 text-lg"
          >
            <Link href={mode === "speaking" ? "/practice/writing" : "/practice/speaking"}>
              Switch to {mode === "speaking" ? "Writing" : "Speaking"}
            </Link>
          </Button>
        </div>
      </main>
    </div>
  )
}

export default function PracticeSummaryPage() {
  return (
    <Suspense fallback={null}>
      <SummaryContent />
    </Suspense>
  )
}
