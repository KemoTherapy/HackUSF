"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { GraduationCap, Target, ArrowRight, Clapperboard } from "lucide-react"
import { useStore } from "@/lib/store"

export default function HomePage() {
  const router = useRouter()
  const { setResourcesFlow } = useStore()
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Logo */}
      <header className="absolute top-6 left-6 md:top-8 md:left-12">
        <h1 className="text-2xl font-bold text-foreground">Lingua</h1>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 md:px-12">
        {/* Hero section */}
        <div className="w-full text-center mb-12 flex flex-col items-center justify-center">
          <h2 className="text-4xl md:text-6xl font-extrabold text-foreground mb-4 text-balance">
            Practice the conversations that matter most.
          </h2>
          <p className="text-lg md:text-xl text-muted max-w-2xl">
            Language barriers isolate people every day — at the doctor, at work, in a new country.
            Lingua lets you practice real conversations with AI before the stakes are real.
          </p>
        </div>

        {/* CTA Cards */}
        <div className="w-full max-w-6xl grid md:grid-cols-3 gap-6">
          {/* Learn Card */}
          <button
            type="button"
            onClick={() => {
              setResourcesFlow(false)
              router.push("/learn/language")
            }}
            className="group relative min-h-[280px] rounded-2xl bg-card p-8 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] card-shadow hover:ring-2 hover:ring-primary hover:glow-primary"
          >
            <div className="flex flex-col">
              <div className="relative mb-8">
                <div className="absolute left-0 top-0 w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground text-center">Learn</h3>
              </div>
              <p className="text-muted leading-relaxed">
                Role-play real situations — a doctor's visit, a job interview, checking into a hotel — at your own pace, with an AI that adapts to your level.
              </p>
            </div>
            <div className="mt-6 flex justify-center">
              <span className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold transition-all group-hover:gap-3">
                Start Learning
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </button>

          {/* Practice Card */}
          <Link
            href="/practice"
            className="group relative min-h-[280px] rounded-2xl bg-card p-8 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] card-shadow hover:ring-2 hover:ring-secondary hover:glow-secondary"
          >
            <div className="flex flex-col">
              <div className="relative mb-8">
                <div className="absolute left-0 top-0 w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                  <Target className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground text-center">Practice</h3>
              </div>
              <p className="text-muted leading-relaxed text-center">
                Free-form conversation on any topic, at your level. No judgment, no pressure — just talk and get real feedback.
              </p>
            </div>
            <div className="mt-6 flex justify-center">
              <span className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary text-white font-semibold transition-all group-hover:gap-3">
                Start Practicing
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>

          {/* Resources Card */}
          <button
            type="button"
            onClick={() => {
              setResourcesFlow(true)
              router.push("/learn/language")
            }}
            className="group relative min-h-[280px] rounded-2xl bg-card p-8 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] card-shadow hover:ring-2 hover:ring-yellow-500 hover:glow-yellow"
          >
            <div className="flex flex-col">
              <div className="relative mb-8">
                <div className="absolute left-0 top-0 w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                  <Clapperboard className="w-6 h-6 text-yellow-500" />
                </div>
                <h3 className="text-2xl font-bold text-foreground text-center">Resources</h3>
              </div>
              <p className="text-muted leading-relaxed">
                Immerse yourself in the language through music, films, and cultural media. Learn naturally through content you actually enjoy.
              </p>
            </div>
            <div className="mt-6 flex justify-center">
              <span className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-yellow-500 text-white font-semibold transition-all group-hover:gap-3">
                Explore Resources
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center">
        <p className="text-sm text-muted">
          No account needed &middot; Progress saved in your browser &middot; Built for real people in real situations
        </p>
      </footer>
    </div>
  )
}