"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  earned: number
  total?: number
  animated?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

export function StarRating({
  earned,
  total = 5,
  animated = false,
  size = "md",
  className,
}: StarRatingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: total }).map((_, index) => {
        const isEarned = index < earned
        return (
          <Star
            key={index}
            className={cn(
              sizeClasses[size],
              "transition-all duration-300",
              isEarned
                ? "fill-gold text-gold drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]"
                : "fill-transparent text-disabled",
              animated && isEarned && "animate-star-burst",
            )}
            style={animated && isEarned ? { animationDelay: `${index * 150}ms` } : undefined}
          />
        )
      })}
    </div>
  )
}
