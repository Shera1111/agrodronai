'use client'

import Link from 'next/link'
import { PageHeader } from '@/components/page-header'
import { useAnalyses, type AnalysisRecord } from '@/lib/store'

type Cell = string | number

// Разделитель точка с запятой: так CSV корректно открывается в Excel с русскими настройками.
function csvCell(value: Cell): string {
  const s = String(value)
  return /[";\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

function downloadCsv(fileName: string, rows: Cell[][]) {
  const text = '\uFEFF' + rows.map((r) => r.map(csvCell).join(';')).join('\r\n')
  const blob = new Blob([text], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

function exportSummary(records: AnalysisRecord[]) {
  downloadCsv('agro-drone-reports.csv', [
    ['Date', 'File', 'Width px', 'Height px', 'Weeds', 'Max confidence %', 'Average confidence %'],
    ...records.map((r) => [
      r.analyzedAt,
      r.fileName,
      r.width,
      r.height,
      r.weeds,
      r.maxConfidence,
      r.avgConfidence,
    ]),
  ])
}

function exportDetections(records: AnalysisRecord[]) {
  const rows: Cell[][] = [['File', 'Date', 'x_min px', 'y_min px', 'x_max px', 'y_max px', 'Confidence %']]
  for (const r of records) {
    for (const d of r.detections) {
      rows.push([
        r.fileName,
        r.analyzedAt,
        Math.round((d.box.left / 100) * r.width),
        Math.round((d.box.top / 100) * r.height),
        Math.round(((d.box.left + d.box.width) / 100) * r.width),
        Math.round(((d.box.top + d.box.height) / 100) * r.height),
        d.confidence,
      ])
    }
  }
  downloadCsv('agro-drone-detections.csv', rows)
}

export default function ReportsPage() {
  const { records, ready } = useAnalyses()

  return (
    <main>
      <PageHeader
        title="Reports"
        description="History of analyses saved in this browser."
        actions={
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => exportSummary(records)}
              disabled={records.length === 0}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-50"
            >
              Export summary (CSV)
            </button>
            <button
              onClick={() => exportDetections(records)}
              disabled={records.length === 0}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              Export all detections (CSV)
            </button>
          </div>
        }
      />

      <div className="p-6 lg:p-8">
        {!ready ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : records.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <p className="text-sm font-medium text-foreground">No reports yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Each analysis you run on the Inspection page appears here.
            </p>
            <Link
              href="/inspection"
              className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Go to Inspection
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-border bg-muted text-xs text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">File</th>
                  <th className="px-4 py-3 font-medium">Size</th>
                  <th className="px-4 py-3 font-medium">Weeds</th>
                  <th className="px-4 py-3 font-medium">Max confidence</th>
                  <th className="px-4 py-3 font-medium">Result</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.id} className="border-b border-border last:border-0">
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{formatDate(r.analyzedAt)}</td>
                    <td className="max-w-[260px] truncate px-4 py-3 font-medium text-foreground" title={r.fileName}>
                      {r.fileName}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                      {r.width}×{r.height}
                    </td>
                    <td className="px-4 py-3 text-foreground">{r.weeds}</td>
                    <td className="px-4 py-3 text-foreground">{r.weeds ? `${r.maxConfidence}%` : '—'}</td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          r.weeds
                            ? 'rounded-full border border-warning/30 bg-warning/15 px-2 py-0.5 text-[11px] font-medium text-warning-foreground'
                            : 'rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground'
                        }
                      >
                        {r.weeds ? 'Weeds detected' : 'No weeds detected'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-3 text-xs text-muted-foreground">
          Reports are stored in this browser only. Coordinates in the detections file are in pixels of the original image.
        </p>
      </div>
    </main>
  )
}