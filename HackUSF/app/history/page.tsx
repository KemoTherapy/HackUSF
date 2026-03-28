"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/layout/app-shell"
import { PageHeader } from "@/components/layout/page-header"
import { SessionHistoryCard } from "@/components/cards/session-history-card"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import type { PracticeSession } from "@/lib/types"

type FilterType = "all" | "lesson" | "speaking" | "writing"

export default function HistoryPage() {
  const router = useRouter()
  const { session, isHydrated } = useStore()
  const [filter, setFilter] = useState<FilterType>("all")

  const filters: { value: FilterType; label: string }[] = [
    { value: "all", label: "All" },
    { value: "lesson", label: "Lessons" },
    { value: "speaking", label: "Speaking" },
    { value: "writing", label: "Writing" },
  ]

  const filteredSessions = session.sessions
    .filter((s) => filter === "all" || s.mode === filter)
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())

  const handleSessionClick = (practiceSession: PracticeSession) => {
    if (practiceSession.mode === "lesson") {
      router.push(`/learn/summary?sessionId=${practiceSession.id}`)
    } else {
      router.push(`/practice/summary?sessionId=${practiceSession.id}&mode=${practiceSession.mode}`)
    }
  }

  if (!isHydrated) {
    return null
  }

  return (
    <AppShell showBackButton backHref="/dashboard">
      <div className="max-w-[800px] mx-auto px-6 py-8 md:px-12 pb-32">
        <PageHeader
          title="Your Sessions"
          breadcrumb={
            <span className="text-sm text-muted">
              Guest session &middot; Temporary
            </span>
          }
        />

        {/* Filter pills */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {filters.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                filter === f.value
                  ? "bg-primary text-white"
                  : "bg-card text-muted hover:text-foreground",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Session list */}
        {filteredSessions.length > 0 ? (
          <div className="space-y-4">
            {filteredSessions.map((practiceSession) => (
              <SessionHistoryCard
                key={practiceSession.id}
                session={practiceSession}
                onClick={() => handleSessionClick(practiceSession)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted text-lg mb-4">No sessions yet</p>
            <p className="text-sm text-disabled">
              Complete a lesson or practice session to see it here.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  )
}
