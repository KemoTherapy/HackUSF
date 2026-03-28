import { cn, getCefrBadgeColors } from "@/lib/utils"
import type { CefrLevel } from "@/lib/types"

interface CefrBadgeProps {
  level: CefrLevel
  size?: "sm" | "md"
  className?: string
}

export function CefrBadge({ level, size = "md", className }: CefrBadgeProps) {
  const colors = getCefrBadgeColors(level)

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold",
        colors.bg,
        colors.text,
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
        className,
      )}
    >
      {level}
    </span>
  )
}
