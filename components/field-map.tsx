'use client'

import { useState } from 'react'
import { fields, statusStyles, type Field } from '@/lib/data'
import { cn } from '@/lib/utils'
import { MapPin } from 'lucide-react'

export function FieldMap() {
  const [selected, setSelected] = useState<Field>(fields[1])

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
      <div
        className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-border"
        style={{
          backgroundImage:
            'linear-gradient(135deg, oklch(0.93 0.03 145) 0%, oklch(0.9 0.04 150) 100%)',
        }}
      >
        {/* faux parcel grid */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'linear-gradient(oklch(0.8 0.03 150 / 0.5) 1px, transparent 1px), linear-gradient(90deg, oklch(0.8 0.03 150 / 0.5) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
          aria-hidden
        />
        {/* faux river */}
        <div
          className="absolute inset-x-0 top-[45%] h-8 -rotate-6 bg-accent/20 blur-sm"
          aria-hidden
        />

        {fields.map((f) => {
          const s = statusStyles[f.status]
          const isSelected = selected.id === f.id
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setSelected(f)}
              className="absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
              style={{ left: `${f.x}%`, top: `${f.y}%` }}
              aria-label={`${f.name} — ${s.label}`}
            >
              <span className="relative flex items-center justify-center">
                {f.status === 'issue' ? (
                  <span className={cn('absolute h-8 w-8 animate-ping rounded-full opacity-30', s.dot)} />
                ) : null}
                <span
                  className={cn(
                    'flex items-center justify-center rounded-full text-white shadow-md ring-2 ring-white transition-transform',
                    s.dot,
                    isSelected ? 'h-9 w-9 scale-110' : 'h-6 w-6',
                  )}
                >
                  {isSelected ? <MapPin className="h-4 w-4" /> : null}
                </span>
              </span>
            </button>
          )
        })}

        {/* legend */}
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-3 rounded-lg bg-card/90 px-3 py-2 text-xs shadow-sm backdrop-blur">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-primary" /> Healthy
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-warning" /> Monitor
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-destructive" /> Issue
          </span>
        </div>
      </div>

      {/* selected field detail */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">{selected.id}</span>
          <span
            className={cn(
              'rounded-full border px-2 py-0.5 text-xs font-medium',
              statusStyles[selected.status].badge,
            )}
          >
            {statusStyles[selected.status].label}
          </span>
        </div>
        <h3 className="mt-2 text-lg font-semibold text-foreground">{selected.name}</h3>
        <p className="text-sm text-muted-foreground">
          {selected.crop} · {selected.acres} acres
        </p>

        <div className="mt-4 space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Health score</span>
            <span className="font-semibold text-foreground">{selected.health}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                'h-full rounded-full',
                selected.health >= 85
                  ? 'bg-primary'
                  : selected.health >= 70
                    ? 'bg-warning'
                    : 'bg-destructive',
              )}
              style={{ width: `${selected.health}%` }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Last scan</span>
            <span className="font-medium text-foreground">{selected.lastScan}</span>
          </div>
        </div>

        <p className="mt-4 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
          {selected.note}
        </p>
      </div>
    </div>
  )
}
