"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowLeft, Home, BookOpen, Target, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"

interface AppShellProps {
  children: React.ReactNode
  showBackButton?: boolean
  backHref?: string
  hideNav?: boolean
}

export function AppShell({
  children,
  showBackButton = false,
  backHref = "/",
  hideNav = false,
}: AppShellProps) {
  const pathname = usePathname()

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/learn/language", icon: BookOpen, label: "Learn" },
    { href: "/practice", icon: Target, label: "Practice" },
    { href: "/dashboard", icon: BarChart3, label: "Dashboard" },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Back button */}
      {showBackButton && (
        <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="max-w-[1200px] mx-auto px-6 py-4 md:px-12">
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 text-muted hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Back</span>
            </Link>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Bottom nav (mobile only) */}
      {!hideNav && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border md:hidden">
          <div className="flex items-center justify-around py-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== "/" && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
                    isActive ? "text-primary" : "text-muted hover:text-foreground",
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-xs">{item.label}</span>
                  {isActive && (
                    <div className="w-1 h-1 rounded-full bg-primary" />
                  )}
                </Link>
              )
            })}
          </div>
        </nav>
      )}
    </div>
  )
}
