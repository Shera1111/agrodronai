import { PageHeader } from '@/components/page-header'
import { SummaryCards } from '@/components/dashboard/summary-cards'
import { FieldMap } from '@/components/field-map'
import { UploadButton } from '@/components/upload-button'
import { Card } from '@/components/ui/card'
import { fields, statusStyles } from '@/lib/data'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function DashboardPage() {
  return (
    <main>
      <PageHeader
        title="Dashboard"
        description="Fleet-wide crop intelligence across all monitored fields."
        actions={<UploadButton />}
      />

      <div className="space-y-6 p-6 lg:p-8">
        <SummaryCards />

        <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-foreground">Field Map</h2>
                <p className="text-sm text-muted-foreground">
                  Color-coded crop health across active parcels.
                </p>
              </div>
              <Link
                href="/maps"
                className="flex items-center gap-1 text-sm font-medium text-accent hover:underline"
              >
                Full map <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <FieldMap />
          </Card>

          <Card className="p-5">
            <h2 className="text-base font-semibold text-foreground">Field Status</h2>
            <p className="text-sm text-muted-foreground">Latest scan per parcel.</p>
            <ul className="mt-4 space-y-2">
              {fields.map((f) => {
                const s = statusStyles[f.status]
                return (
                  <li
                    key={f.id}
                    className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5"
                  >
                    <span className={cn('h-2.5 w-2.5 shrink-0 rounded-full', s.dot)} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{f.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {f.crop} · {f.acres} ac
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-foreground">{f.health}%</span>
                  </li>
                )
              })}
            </ul>
          </Card>
        </div>
      </div>
    </main>
  )
}
