import { cn } from "@/lib/utils"
import { ScoreBar } from "@/components/ui/score-bar"
import type { AnalysisReport } from "@/lib/types"

interface AnalysisSummaryProps {
  analysis: AnalysisReport
  className?: string
}

export function AnalysisSummary({ analysis, className }: AnalysisSummaryProps) {
  const categories = [
    { key: "pronunciation", label: "Pronunciation" },
    { key: "grammar", label: "Grammar" },
    { key: "vocabulary", label: "Vocabulary" },
    { key: "fluency", label: "Fluency" },
    { key: "naturalness", label: "Naturalness" },
    { key: "confidence", label: "Confidence" },
  ] as const

  return (
    <div className={cn("bg-card rounded-2xl p-6", className)}>
      <h3 className="font-semibold text-foreground mb-6">Overall Performance</h3>
      <div className="space-y-4">
        {categories.map(({ key, label }) => (
          <ScoreBar
            key={key}
            label={label}
            score={analysis.categories[key].score}
          />
        ))}
      </div>
    </div>
  )
}
