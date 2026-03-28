"use client"

import Link from "next/link"
import { Check, Target, ArrowRight } from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { PageHeader } from "@/components/layout/page-header"
import { ProgressRing } from "@/components/ui/progress-ring"
import { CefrBadge } from "@/components/ui/cefr-badge"
import { Button } from "@/components/ui/button"
import { LEVELS, SCENARIOS, REGIONS } from "@/lib/constants"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  const { session, isHydrated } = useStore()

  const selectedRegion = REGIONS.find((r) => r.id === session.region)

  // Calculate stats
  const lessonsCompleted = session.sessions.filter((s) => s.mode === "lesson").length
  const totalSessions = session.sessions.length
  const uniqueWords = Math.floor(totalSessions * 7.2) // Mock calculation

  // Calculate level progress percentages
  const getLevelProgress = (level: (typeof LEVELS)[number]["level"]) => {
    const progress = session.levelProgress[level]
    // Each scenario can give up to 5 stars, 4 scenarios total = 20 max stars per level
    const maxStars = 20
    const earnedStars = progress.scenariosCompleted.length * progress.starsEarned
    return Math.round((earnedStars / maxStars) * 100)
  }

  // Mock common mistakes
  const commonMistakes = [
    { type: "Gender agreement", count: 6 },
    { type: "Verb tense", count: 4 },
    { type: "Pronunciation: R sounds", count: 3 },
  ]

  // Mock strengths
  const strengths = ["Strong vocabulary", "Consistent responses", "Good sentence length"]

  // Get next recommended scenario
  const getNextRecommendation = () => {
    const currentProgress = session.levelProgress[session.currentLevel]
    const completedScenarios = currentProgress.scenariosCompleted
    const nextScenario = SCENARIOS.find((s) => !completedScenarios.includes(s.id))
    return nextScenario || SCENARIOS[0]
  }

  const nextScenario = getNextRecommendation()

  if (!isHydrated) {
    return null
  }

  return (
    <AppShell>
      <div className="max-w-[1200px] mx-auto px-6 py-8 md:px-12 pb-32">
        <PageHeader
          title="Your Progress"
          breadcrumb={
            <span className="text-sm text-muted">
              Guest mode &middot; Data saved in this browser only
            </span>
          }
        />

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-card rounded-2xl p-6 card-shadow">
            <p className="text-4xl font-bold text-primary mb-1">{lessonsCompleted}</p>
            <p className="text-sm text-muted">Lessons Completed</p>
          </div>
          <div className="bg-card rounded-2xl p-6 card-shadow">
            <p className="text-4xl font-bold text-foreground mb-1">{totalSessions}</p>
            <p className="text-sm text-muted">Sessions Total</p>
          </div>
          <div className="bg-card rounded-2xl p-6 card-shadow">
            <p className="text-4xl font-bold text-foreground mb-1">{uniqueWords}</p>
            <p className="text-sm text-muted">Words Practiced</p>
          </div>
          <div className="bg-card rounded-2xl p-6 card-shadow">
            <CefrBadge level={session.currentLevel} className="text-2xl mb-1" />
            <p className="text-sm text-muted mt-2">Current Level</p>
          </div>
        </div>

        {/* CEFR Progress */}
        <div className="bg-card rounded-2xl p-6 card-shadow mb-8">
          <h3 className="font-semibold text-foreground mb-6">Level Progress</h3>
          <div className="flex items-center justify-between gap-4 overflow-x-auto pb-2">
            {LEVELS.map((level) => {
              const progress = getLevelProgress(level.level)
              const isCompleted = session.levelProgress[level.level].completed
              const isCurrent = session.currentLevel === level.level

              return (
                <div key={level.level} className="flex flex-col items-center gap-2 shrink-0">
                  <ProgressRing
                    value={progress}
                    size={64}
                    color={cn(
                      isCompleted && "stroke-success",
                      isCurrent && !isCompleted && "stroke-primary",
                      !isCompleted && !isCurrent && "stroke-disabled",
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5 text-success" />
                    ) : (
                      <span className={cn(
                        "text-sm font-semibold",
                        isCurrent ? "text-primary" : "text-muted"
                      )}>
                        {progress}%
                      </span>
                    )}
                  </ProgressRing>
                  <CefrBadge level={level.level} size="sm" />
                </div>
              )
            })}
          </div>
        </div>

        {/* Common mistakes & strengths */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Common mistakes */}
          <div className="bg-card rounded-2xl p-6 card-shadow">
            <h3 className="font-semibold text-foreground mb-4">Common Mistakes</h3>
            <div className="space-y-2">
              {commonMistakes.map((mistake, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-muted">{mistake.type}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-error/20 text-error">
                    {mistake.count}x
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths */}
          <div className="bg-card rounded-2xl p-6 card-shadow">
            <h3 className="font-semibold text-foreground mb-4">Strengths</h3>
            <div className="flex flex-wrap gap-2">
              {strengths.map((strength, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full text-sm font-medium bg-success/20 text-success"
                >
                  {strength}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Next recommendation */}
        <div className="bg-card rounded-2xl p-6 card-shadow border border-primary/30">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">Recommended Next</h3>
              <p className="text-muted mb-4">
                <CefrBadge level={session.currentLevel} size="sm" className="mr-2" />
                {nextScenario.name} scenario
                <span className="block text-sm mt-1">
                  Based on your progress with {selectedRegion?.dialect || "Spanish"}
                </span>
              </p>
              <Button asChild className="bg-primary hover:bg-primary/90 text-white">
                <Link href={`/learn/lesson?scenario=${nextScenario.id}`}>
                  Start Lesson
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Link to history */}
        <div className="mt-8 text-center">
          <Link
            href="/history"
            className="text-primary hover:underline inline-flex items-center gap-2"
          >
            View Session History
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </AppShell>
  )
}
