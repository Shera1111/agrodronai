'use client'

import { detections } from '@/lib/data'
import { cn } from '@/lib/utils'
import { AlertTriangle, ShieldCheck, Info, Sparkles } from 'lucide-react'

const riskMeta = {
  high: { label: 'High Risk', className: 'bg-destructive/10 text-destructive border-destructive/20', icon: AlertTriangle },
  medium: { label: 'Medium Risk', className: 'bg-warning/15 text-warning-foreground border-warning/30', icon: Info },
  low: { label: 'Low Risk', className: 'bg-accent/10 text-accent border-accent/20', icon: ShieldCheck },
} as const

export function ResultsPanel({
  active,
  onHover,
}: {
  active: string | null
  onHover: (id: string | null) => void
}) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">AI Detection Results</h2>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {detections.length} objects detected · model v3.2-agri
        </p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {detections.map((d) => {
          const meta = riskMeta[d.risk]
          const Icon = meta.icon
          const isActive = active === d.id
          return (
            <div
              key={d.id}
              onMouseEnter={() => onHover(d.id)}
              onMouseLeave={() => onHover(null)}
              className={cn(
                'rounded-lg border p-3 transition-colors',
                isActive ? 'border-primary bg-primary/5' : 'border-border',
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-mono text-sm font-semibold text-foreground">{d.label}</p>
                  <p className="text-xs text-muted-foreground">
                    Confidence {d.confidence}%
                  </p>
                </div>
                <span
                  className={cn(
                    'flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium',
                    meta.className,
                  )}
                >
                  <Icon className="h-3 w-3" />
                  {meta.label}
                </span>
              </div>

              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    'h-full rounded-full',
                    d.risk === 'high'
                      ? 'bg-destructive'
                      : d.risk === 'medium'
                        ? 'bg-warning'
                        : 'bg-accent',
                  )}
                  style={{ width: `${d.confidence}%` }}
                />
              </div>

              <div className="mt-3 rounded-md bg-muted px-2.5 py-2">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Recommendation
                </p>
                <p className="mt-1 text-xs leading-relaxed text-foreground">{d.recommendation}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="border-t border-border p-4">
        <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90">
          Generate Treatment Plan
        </button>
      </div>
    </div>
  )
}
