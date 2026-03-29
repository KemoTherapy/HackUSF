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
            Speak it. Learn it. Live it.
          </h2>
          <p className="text-lg md:text-xl text-muted max-w-xl">
            Practice Spanish or French with AI-powered lessons and real conversations.
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
            <div>
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Learn</h3>
              <p className="text-muted leading-relaxed">
                Structured lessons with guided scenarios and CEFR level tracking. Perfect for building a solid foundation.
              </p>
            </div>
            <div className="mt-6">
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
            <div>
              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Practice</h3>
              <p className="text-muted leading-relaxed">
                Speaking and writing exercises. Choose your difficulty and dive in for free-form practice.
              </p>
            </div>
            <div className="mt-6">
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
            <div>
              <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center mb-4">
                <Clapperboard className="w-6 h-6 text-yellow-500" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Resources</h3>
              <p className="text-muted leading-relaxed">
                Immerse yourself in the language through music, films, and cultural media. Learn naturally through content you actually enjoy.
              </p>
            </div>
            <div className="mt-6">
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
          Guest mode &middot; No account needed &middot; Progress saved in your browser
        </p>
      </footer>
    </div>
  )
}