"use client"

import Image from "next/image"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { RegionOption } from "@/lib/types"

interface RegionCardProps {
  region: RegionOption
  isSelected: boolean
  onClick: () => void
}

export function RegionCard({ region, isSelected, onClick }: RegionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative w-full h-[360px] rounded-2xl overflow-hidden group transition-all duration-300",
        "hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
        isSelected && "ring-2 ring-primary glow-primary",
      )}
    >
      {/* Background image */}
      <Image
        src={region.imageSrc}
        alt={region.name}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      {/* Selected checkmark */}
      {isSelected && (
        <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <Check className="w-5 h-5 text-white" />
        </div>
      )}

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-left">
        <span className="text-4xl mb-2 block">{region.flag}</span>
        <h3 className="text-2xl font-bold text-white mb-1">{region.name}</h3>
        <p className="text-xs uppercase tracking-wider text-muted mb-2">
          {region.language}
        </p>
        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white backdrop-blur-sm">
          {region.dialect}
        </span>
      </div>
    </button>
  )
}
