import { Card } from '@/components/ui/card'
import { Layers, Bug, HeartPulse, TriangleAlert } from 'lucide-react'
import { summary } from '@/lib/data'
import { cn } from '@/lib/utils'

const cards = [
  {
    label: 'Total Fields Analyzed',
    value: summary.fieldsAnalyzed.toLocaleString(),
    delta: summary.fieldsDelta,
    icon: Layers,
    tone: 'text-accent',
    bg: 'bg-accent/10',
  },
  {
    label: 'Weeds / Diseases Detected',
    value: summary.detections,
    delta: summary.detectionsDelta,
    icon: Bug,
    tone: 'text-destructive',
    bg: 'bg-destructive/10',
  },
  {
    label: 'Average Health Score',
    value: `${summary.healthScore}%`,
    delta: summary.healthDelta,
    icon: HeartPulse,
    tone: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    label: 'Action Required',
    value: summary.actionRequired,
    delta: summary.actionDelta,
    icon: TriangleAlert,
    tone: 'text-warning-foreground',
    bg: 'bg-warning/15',
  },
]

export function SummaryCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((c) => {
        const Icon = c.icon
        return (
          <Card key={c.label} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">{c.label}</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
                  {c.value}
                </p>
              </div>
              <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', c.bg)}>
                <Icon className={cn('h-5 w-5', c.tone)} />
              </div>
            </div>
            <p className="mt-3 text-xs font-medium text-muted-foreground">{c.delta}</p>
          </Card>
        )
      })}
    </div>
  )
}
