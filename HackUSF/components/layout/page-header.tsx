import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  subtitle?: string
  breadcrumb?: React.ReactNode
  className?: string
}

export function PageHeader({ title, subtitle, breadcrumb, className }: PageHeaderProps) {
  return (
    <div className={cn("text-center mb-8", className)}>
      {breadcrumb && <div className="mb-4">{breadcrumb}</div>}
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 text-balance">{title}</h1>
      {subtitle && (
        <p className="text-muted text-lg">{subtitle}</p>
      )}
    </div>
  )
}
