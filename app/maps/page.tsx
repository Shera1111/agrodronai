'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { PageHeader } from '@/components/page-header'
import { useAnalyses, type AnalysisRecord } from '@/lib/store'

const COLS = 16

function buildGrid(r: AnalysisRecord) {
  const rows = Math.min(24, Math.max(4, Math.round((COLS * r.height) / (r.width || 1))))
  const counts: number[] = new Array(COLS * rows).fill(0)
  for (const d of r.detections) {
    // Рамки в хранилище заданы в процентах от размера снимка.
    const cx = d.box.left + d.box.width / 2
    const cy = d.box.top + d.box.height / 2
    const col = Math.min(COLS - 1, Math.max(0, Math.floor((cx / 100) * COLS)))
    const row = Math.min(rows - 1, Math.max(0, Math.floor((cy / 100) * rows)))
    counts[row * COLS + col] += 1
  }
  return { rows, counts }
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

function downloadZones(record: AnalysisRecord, rows: number, counts: number[], threshold: number) {
  const lines: string[] = ['x_min px;y_min px;x_max px;y_max px;weeds in cell']
  counts.forEach((c, i) => {
    if (c < threshold) return
    const col = i % COLS
    const row = Math.floor(i / COLS)
    lines.push(
      [
        Math.round((col / COLS) * record.width),
        Math.round((row / rows) * record.height),
        Math.round(((col + 1) / COLS) * record.width),
        Math.round(((row + 1) / rows) * record.height),
        c,
      ].join(';'),
    )
  })
  const blob = new Blob(['\uFEFF' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'agro-drone-spray-zones.csv'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export default function MapsPage() {
  const { records, ready } = useAnalyses()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [threshold, setThreshold] = useState(2)
  const [showBoxes, setShowBoxes] = useState(true)

  const record = records.find((r) => r.id === selectedId) ?? records[0]
  const grid = useMemo(() => (record ? buildGrid(record) : null), [record])

  const maxCount = grid ? Math.max(1, ...grid.counts) : 1
  const total = grid ? grid.counts.length : 0
  const flagged = grid ? grid.counts.filter((c) => c >= threshold).length : 0
  const share = total ? Math.round((flagged / total) * 100) : 0

  return (
    <main>
      <PageHeader
        title="Field Maps"
        description="Weed density and spot-spraying zones built from your saved analyses."
        actions={
          <Link
            href="/inspection"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Analyze a photo
          </Link>
        }
      />

      <div className="p-6 lg:p-8">
        {!ready ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : !record || !grid ? (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <p className="text-sm font-medium text-foreground">No analyses yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Analyze a photo on the Inspection page and its weed map appears here.
            </p>
            <Link
              href="/inspection"
              className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Go to Inspection
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="rounded-xl border border-border bg-card p-4">
              <div
                className="relative w-full overflow-hidden rounded-lg border border-border"
                style={{ aspectRatio: `${record.width} / ${record.height}`, backgroundColor: '#0f2a1d' }}
              >
                <div
                  className="absolute inset-0 grid"
                  style={{
                    gridTemplateColumns: `repeat(${COLS}, 1fr)`,
                    gridTemplateRows: `repeat(${grid.rows}, 1fr)`,
                  }}
                >
                  {grid.counts.map((c, i) => (
                    <div
                      key={i}
                      title={c ? `${c} weeds in this cell` : undefined}
                      style={{
                        border: '1px solid rgba(255,255,255,0.06)',
                        backgroundColor:
                          c >= threshold
                            ? `rgba(239, 68, 68, ${0.25 + 0.55 * (c / maxCount)})`
                            : c > 0
                              ? 'rgba(250, 204, 21, 0.2)'
                              : 'transparent',
                      }}
                    />
                  ))}
                </div>
                {showBoxes &&
                  record.detections.map((d, i) => (
                    <div
                      key={i}
                      className="absolute"
                      style={{
                        left: `${d.box.left}%`,
                        top: `${d.box.top}%`,
                        width: `${d.box.width}%`,
                        height: `${d.box.height}%`,
                        border: '1px solid rgba(255,255,255,0.85)',
                      }}
                    />
                  ))}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: 'rgba(239,68,68,0.6)' }} />
                  Spray zone ({threshold}+ weeds)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: 'rgba(250,204,21,0.35)' }} />
                  Some weeds, below threshold
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-3 w-3 rounded-sm border border-white/80" style={{ backgroundColor: '#0f2a1d' }} />
                  Detected weed box
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-card p-4">
                <label className="text-xs font-medium text-muted-foreground" htmlFor="analysis">
                  Analysis
                </label>
                <select
                  id="analysis"
                  value={record.id}
                  onChange={(e) => setSelectedId(e.target.value)}
                  className="mt-1 w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm text-foreground"
                >
                  {records.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.fileName} · {formatDate(r.analyzedAt)}
                    </option>
                  ))}
                </select>

                <label className="mt-4 block text-xs font-medium text-muted-foreground" htmlFor="threshold">
                  Spray zone threshold (weeds per cell)
                </label>
                <select
                  id="threshold"
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  className="mt-1 w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm text-foreground"
                >
                  {[1, 2, 3, 5].map((t) => (
                    <option key={t} value={t}>
                      {t} or more
                    </option>
                  ))}
                </select>

                <label className="mt-4 flex items-center gap-2 text-sm text-foreground">
                  <input type="checkbox" checked={showBoxes} onChange={(e) => setShowBoxes(e.target.checked)} />
                  Show detected boxes
                </label>
              </div>

              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs font-medium text-muted-foreground">Weeds detected</p>
                <p className="mt-1 text-2xl font-semibold text-foreground">{record.weeds}</p>
                <p className="mt-3 text-xs font-medium text-muted-foreground">Area flagged for spot-spraying</p>
                <p className="mt-1 text-2xl font-semibold text-foreground">{share}%</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {flagged} of {total} cells. Blanket spraying would cover 100% of the image.
                </p>
                <button
                  onClick={() => downloadZones(record, grid.rows, grid.counts, threshold)}
                  disabled={flagged === 0}
                  className="mt-4 w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
                >
                  Export spray zones (CSV)
                </button>
              </div>

              <p className="text-xs leading-relaxed text-muted-foreground">
                The map is built from the weeds the model found. The model misses some weeds, so treat the zones as an
                estimate, not a guarantee. Results are stored in this browser only.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}