'use client'

import { useState } from 'react'
import Image from 'next/image'
import { detections } from '@/lib/data'
import { cn } from '@/lib/utils'

const riskColor: Record<string, string> = {
  high: 'border-destructive text-destructive',
  medium: 'border-warning text-warning-foreground',
  low: 'border-accent text-accent',
}

const riskBoxBorder: Record<string, string> = {
  high: 'border-destructive',
  medium: 'border-warning',
  low: 'border-accent',
}

export function DetectionViewer({
  active,
  onHover,
}: {
  active: string | null
  onHover: (id: string | null) => void
}) {
  const [showBoxes, setShowBoxes] = useState(true)

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-foreground">Maple Hollow · Sector 4</p>
          <p className="text-xs text-muted-foreground">Captured 30m ago · 4096×2731 · Drone DJI-M3</p>
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-muted-foreground">
          <input
            type="checkbox"
            checked={showBoxes}
            onChange={(e) => setShowBoxes(e.target.checked)}
            className="h-3.5 w-3.5 accent-[var(--primary)]"
          />
          Bounding boxes
        </label>
      </div>

      <div className="relative aspect-[4/3] w-full bg-muted">
        <Image
          src="/field-aerial.png"
          alt="Aerial drone photo of Maple Hollow crop field under AI analysis"
          fill
          className="object-cover"
          priority
        />

        {showBoxes &&
          detections.map((d) => {
            const isActive = active === d.id
            return (
              <div
                key={d.id}
                onMouseEnter={() => onHover(d.id)}
                onMouseLeave={() => onHover(null)}
                className={cn(
                  'absolute border-2 transition-all',
                  riskBoxBorder[d.risk],
                  isActive ? 'z-10 shadow-lg' : 'opacity-90',
                )}
                style={{
                  top: `${d.box.top}%`,
                  left: `${d.box.left}%`,
                  width: `${d.box.width}%`,
                  height: `${d.box.height}%`,
                  backgroundColor: isActive
                    ? 'oklch(1 0 0 / 0.12)'
                    : 'transparent',
                }}
              >
                <span
                  className={cn(
                    'absolute -top-6 left-0 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[11px] font-semibold text-white shadow',
                    d.risk === 'high'
                      ? 'bg-destructive'
                      : d.risk === 'medium'
                        ? 'bg-warning text-warning-foreground'
                        : 'bg-accent',
                  )}
                >
                  {d.label} {d.confidence}%
                </span>
              </div>
            )
          })}
      </div>
    </div>
  )
}
