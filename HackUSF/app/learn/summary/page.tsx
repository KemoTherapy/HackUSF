"use client"

import { Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Sparkles, Target, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StarRating } from "@/components/ui/star-rating"
import { AnalysisSummary } from "@/components/analysis/analysis-summary"
import { FeedbackCategory } from "@/components/analysis/feedback-category"
import { ConversationTranscript } from "@/components/conversation/ConversationTranscript"
import { useStore } from "@/lib/store"
import { REGIONS } from "@/lib/constants"
import type { AnalysisReport, Correction } from "@/lib/types"

// Mock analysis for demo purposes
const mockAnalysis: AnalysisReport = {
  overallScore: 82,
  starsEarned: 4,
  categories: {
    pronunciation: { score: 78, notes: ["Good intonation", "Work on rolled R sounds"] },
    grammar: { score: 85, notes: ["Correct verb conjugations", "Minor article errors"] },
    vocabulary: { score: 88, notes: ["Good word variety", "Used context-appropriate terms"] },
    fluency: { score: 75, notes: ["Some pauses", "Generally smooth delivery"] },
    naturalness: { score: 80, notes: ["Good sentence structure", "Could use more connectors"] },
    confidence: { score: 85, notes: ["Strong voice", "Minimal hesitation"] },
  },
  strengths: ["Strong vocabulary", "Good confidence", "Correct sentence structure"],
  weaknesses: ["Rolled R pronunciation", "Article agreement"],
  corrections: [
    {
      original: "Yo quiero un mesa",
      corrected: "Yo quiero una mesa",
      explanation: "Mesa is feminine, so use 'una' instead of 'un'",
      type: "grammar",
    },
    {
      original: "para comer aqui",
      corrected: "para comer aquí",
      explanation: "Don't forget the accent on 'aquí'",
      type: "grammar",
    },
  ],
  nextSteps: [
    "Practice gender agreement with nouns",
    "Work on rolled R sounds",
    "Try the Coffee Shop scenario next",
  ],
}

function SummaryContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("sessionId")
  const { session, isHydrated } = useStore()

  const practiceSession = session.sessions.find((s) => s.id === sessionId)
  const analysis = practiceSession?.analysis || mockAnalysis
  const transcript = practiceSession?.transcript || []
  const regionData = REGIONS.find((r) => r.id === practiceSession?.region)

  // Group corrections by type
  const grammarCorrections = analysis.corrections.filter((c: Correction) => c.type === "grammar")
  const vocabCorrections = analysis.corrections.filter((c: Correction) => c.type === "vocabulary")
  const pronunciationCorrections = analysis.corrections.filter((c: Correction) => c.type === "pronunciation")

  if (!isHydrated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-[800px] mx-auto px-6 py-4">
          <Link
            href="/learn/scenarios"
            className="inline-flex items-center gap-2 text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Back to Scenarios</span>
          </Link>
        </div>
      </header>

      <main className="max-w-[800px] mx-auto px-6 py-8 pb-32">
        {/* Celebration header */}
        <div className="text-center mb-12">
          {analysis.starsEarned >= 4 && (
            <div className="flex justify-center mb-4">
              <Sparkles className="w-12 h-12 text-gold animate-pulse" />
            </div>
          )}

          <StarRating
            earned={analysis.starsEarned}
            size="lg"
            animated
            className="justify-center mb-4"
          />

          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Lesson Complete!
          </h1>

          <p className="text-xl text-muted">
            Score: <span className="text-foreground font-semibold">{analysis.overallScore}</span> / 100
          </p>
        </div>

        {/* Analysis sections */}
        <div className="space-y-6">
          {/* Overall Performance */}
          <AnalysisSummary analysis={analysis} />

          {/* Transcript */}
          {transcript.length > 0 && (
            <ConversationTranscript
              turns={transcript}
              corrections={analysis.corrections}
              flag={regionData?.flag}
            />
          )}

          {/* Feedback by category */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground px-2">Key Feedback</h3>
            <FeedbackCategory title="Grammar" corrections={grammarCorrections} />
            <FeedbackCategory title="Vocabulary" corrections={vocabCorrections} />
            <FeedbackCategory title="Pronunciation" corrections={pronunciationCorrections} />
          </div>

          {/* Next steps */}
          <div className="bg-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">What to work on next</h3>
            </div>
            <ul className="space-y-2">
              {analysis.nextSteps.map((step: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-muted">
                  <span className="text-primary">•</span>
                  {step}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="mt-12 flex flex-col md:flex-row gap-4">
          <Button
            asChild
            className="flex-1 bg-primary hover:bg-primary/90 text-white py-6 text-lg"
          >
            <Link href="/practice">Practice This Level</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="flex-1 py-6 text-lg"
          >
            <Link href="/learn/scenarios">Try Another Scenario</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="flex-1 py-6 text-lg"
          >
            <Link href="/learn/level">Back to Levels</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}

export default function LessonSummaryPage() {
  return (
    <Suspense fallback={null}>
      <SummaryContent />
    </Suspense>
  )
}
