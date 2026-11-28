'use client'

import Link from 'next/link'
import { PageHeader } from '@/components/page-header'
import { clearAnalyses, useAnalyses } from '@/lib/store'

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

function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

export default function DashboardPage() {
  const { records, ready } = useAnalyses()

  const totalWeeds = records.reduce((sum, r) => sum + r.weeds, 0)
  const withWeeds = records.filter((r) => r.weeds > 0)
  const avgConfidence = withWeeds.length
    ? Math.round(withWeeds.reduce((sum, r) => sum + r.avgConfidence, 0) / withWeeds.length)
    : 0
  const strong = records.reduce((sum, r) => sum + r.high, 0)

  const recent = records.slice(0, 10).reverse() // от старых к новым для графика
  const maxWeeds = Math.max(1, ...recent.map((r) => r.weeds))

  return (
    <main>
      <PageHeader
        title="Dashboard"
        description="Summary of the analyses you have run in this browser."
        actions={
          <Link
            href="/inspection"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Analyze a photo
          </Link>
        }
      />

      <div className="space-y-6 p-6 lg:p-8">
        {!ready ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : records.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <p className="text-sm font-medium text-foreground">No analyses yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Upload a drone photo on the Inspection page. Every result is saved here automatically.
            </p>
            <Link
              href="/inspection"
              className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Go to Inspection
            </Link>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Images analyzed" value={String(records.length)} />
              <StatCard label="Weeds detected" value={String(totalWeeds)} hint="Total boxes found by the model" />
              <StatCard
                label="Average confidence"
                value={withWeeds.length ? `${avgConfidence}%` : '—'}
                hint="Over images with detections"
              />
              <StatCard
                label="High-confidence detections"
                value={String(strong)}
                hint="Confidence of 60% or more"
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
              <div className="rounded-xl border border-border bg-card p-4">
                <h2 className="text-sm font-semibold text-foreground">Weeds per image (latest 10)</h2>
                <div className="mt-4 flex h-40 items-end gap-2">
                  {recent.map((r) => (
                    <div key={r.id} className="flex min-w-0 flex-1 flex-col items-center gap-1">
                      <span className="text-[11px] text-muted-foreground">{r.weeds}</span>
                      <div
                        className="w-full rounded-t bg-primary"
                        style={{ height: `${Math.max(4, (r.weeds / maxWeeds) * 100)}%` }}
                        title={r.fileName}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-4">
                <h2 className="text-sm font-semibold text-foreground">Latest analyses</h2>
                <ul className="mt-3 space-y-2">
                  {records.slice(0, 5).map((r) => (
                    <li key={r.id} className="rounded-lg bg-muted px-3 py-2">
                      <p className="truncate text-xs font-medium text-foreground">{r.fileName}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {formatDate(r.analyzedAt)} · {r.weeds} weeds
                      </p>
                    </li>
                  ))}
                </ul>
                <Link href="/reports" className="mt-3 inline-block text-xs font-medium text-primary hover:underline">
                  All reports
                </Link>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
              <p>Results are stored in this browser only, not in a database.</p>
              <button
                onClick={() => {
                  if (window.confirm('Delete all saved analyses from this browser?')) clearAnalyses()
                }}
                className="rounded-md border border-border px-3 py-1.5 font-medium text-foreground hover:bg-muted"
              >
                Clear saved results
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  )
}