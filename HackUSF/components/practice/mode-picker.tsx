"use client"

import Link from "next/link"
import { Mic, BookOpen, Stethoscope, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { CefrLevel } from "@/lib/types"

interface ModePickerProps {
  selectedLevel: CefrLevel
  className?: string
}

export function ModePicker({ selectedLevel, className }: ModePickerProps) {
  return (
    <div className={cn("grid md:grid-cols-3 gap-6", className)}>
      {/* Speaking Mode */}
      <Link
        href={`/practice/speaking?level=${selectedLevel}`}
        className="group relative min-h-[240px] rounded-2xl bg-card p-6 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] card-shadow hover:ring-2 hover:ring-primary hover:glow-primary"
      >
        <div>
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
            <Mic className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">Speaking</h3>
          <p className="text-muted leading-relaxed">
            Have a real conversation with the AI in your chosen language. Pick a topic and just talk.
          </p>
        </div>
        <div className="mt-4">
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-semibold transition-all group-hover:gap-3">
            Start Speaking
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </Link>

      {/* Writing Mode */}
      <Link
        href={`/practice/writing?level=${selectedLevel}`}
        className="group relative min-h-[240px] rounded-2xl bg-card p-6 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] card-shadow hover:ring-2 hover:ring-tertiary hover:shadow-[0_0_20px_rgba(78,205,196,0.4)]"
      >
        <div>
          <div className="w-12 h-12 rounded-xl bg-tertiary/20 flex items-center justify-center mb-4">
            <BookOpen className="w-6 h-6 text-tertiary" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">Writing & Reading</h3>
          <p className="text-muted leading-relaxed">
            Read passages and complete exercises. A good way to sharpen your grammar and vocabulary.
          </p>
        </div>
        <div className="mt-4">
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-tertiary text-white font-semibold transition-all group-hover:gap-3">
            Start Exercises
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </Link>

      {/* Medical Vocabulary Mode */}
      <Link
        href={`/practice/writing?level=${selectedLevel}&topic=medical`}
        className="group relative min-h-[240px] rounded-2xl bg-card p-6 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] card-shadow hover:ring-2 hover:ring-rose-500 hover:shadow-[0_0_20px_rgba(244,63,94,0.3)]"
      >
        <div>
          <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center mb-4">
            <Stethoscope className="w-6 h-6 text-rose-500" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">Medical Vocabulary</h3>
          <p className="text-muted leading-relaxed">
            Exercises focused on medical terms, patient interactions, symptoms, and clinical language — built for healthcare workers in the field.
          </p>
        </div>
        <div className="mt-4">
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500 text-white font-semibold transition-all group-hover:gap-3">
            Medical Exercises
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </Link>
    </div>
  )
}
