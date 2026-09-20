'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Detection } from '@/lib/data'
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
  detections,
  title,
  subtitle,
  loading,
  imageSrc,
}: {
  active: string | null
  onHover: (id: string | null) => void
  detections: Detection[]
  title: string
  subtitle: string
  loading?: boolean
  imageSrc?: string

}) {
  const [showBoxes, setShowBoxes] = useState(true)

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
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
          src={imageSrc || '/field-aerial.png'}
          alt="Aerial drone photo of the crop field under AI analysis"
          fill
          unoptimized={imageSrc?.startsWith('blob:')}
          className="object-cover"
          priority
        />

        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/60 backdrop-blur-sm">
            <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm">
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              Analyzing imagery…
            </div>
          </div>
        )}

        {showBoxes &&
          !loading &&
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
