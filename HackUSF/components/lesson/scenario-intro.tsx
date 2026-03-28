import { MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

interface ScenarioIntroProps {
  context: string
  goal: string
  className?: string
}

export function ScenarioIntro({ context, goal, className }: ScenarioIntroProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-background-elevated p-4 border-l-4 border-primary",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
        <div>
          <p className="text-foreground font-medium mb-1">{context}</p>
          <p className="text-muted text-sm">Your goal: {goal}</p>
        </div>
      </div>
    </div>
  )
}
