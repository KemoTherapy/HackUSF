import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Convert score (0-100) to stars (0-5)
export function scoreToStars(score: number): number {
  return Math.min(5, Math.ceil((score / 100) * 5))
}

// Format time in minutes and seconds
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Format relative time (e.g., "5 min ago", "2 hours ago")
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins} min ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  return date.toLocaleDateString()
}

// Get color class based on score
export function getScoreColor(score: number): string {
  if (score >= 70) return "bg-success"
  if (score >= 40) return "bg-warning"
  return "bg-error"
}

// Get CEFR badge color classes
export function getCefrBadgeColors(level: string): { bg: string; text: string } {
  switch (level) {
    case "A1":
    case "A2":
      return { bg: "bg-success/20", text: "text-success" }
    case "B1":
    case "B2":
      return { bg: "bg-warning/20", text: "text-warning" }
    case "C1":
    case "C2":
      return { bg: "bg-purple-500/20", text: "text-purple-400" }
    default:
      return { bg: "bg-muted/20", text: "text-muted" }
  }
}
