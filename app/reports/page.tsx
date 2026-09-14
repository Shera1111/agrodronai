import { PageHeader } from '@/components/page-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { reports } from '@/lib/data'
import { Download, FileText } from 'lucide-react'

const statusStyle: Record<string, string> = {
  'Action Required': 'border-destructive/20 bg-destructive/10 text-destructive',
  Monitor: 'border-warning/30 bg-warning/15 text-warning-foreground',
  Clear: 'border-primary/20 bg-primary/10 text-primary',
}

export default function ReportsPage() {
  return (
    <main>
      <PageHeader
        title="Reports"
        description="Historical scan reports and exportable field analytics."
        actions={
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        }
      />

      <div className="p-6 lg:p-8">
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Report</th>
                  <th className="px-5 py-3 font-medium">Field</th>
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Findings</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium sr-only">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/40">
                    <td className="px-5 py-3">
                      <span className="flex items-center gap-2 font-mono font-medium text-foreground">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {r.id}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-foreground">{r.field}</td>
                    <td className="px-5 py-3 text-muted-foreground">{r.type}</td>
                    <td className="px-5 py-3 text-muted-foreground">{r.date}</td>
                    <td className="px-5 py-3 text-muted-foreground">{r.findings}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full border px-2 py-0.5 text-xs font-medium ${statusStyle[r.status]}`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button className="text-xs font-medium text-accent hover:underline">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </main>
  )
}
