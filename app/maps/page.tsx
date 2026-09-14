import { PageHeader } from '@/components/page-header'
import { FieldMap } from '@/components/field-map'
import { UploadButton } from '@/components/upload-button'
import { Card } from '@/components/ui/card'
import { fields } from '@/lib/data'

export default function MapsPage() {
  const healthy = fields.filter((f) => f.status === 'healthy').length
  const monitor = fields.filter((f) => f.status === 'monitor').length
  const issue = fields.filter((f) => f.status === 'issue').length
  const totalAcres = fields.reduce((sum, f) => sum + f.acres, 0)

  const stats = [
    { label: 'Total parcels', value: fields.length },
    { label: 'Acres monitored', value: totalAcres.toLocaleString() },
    { label: 'Healthy', value: healthy, tone: 'text-primary' },
    { label: 'Monitor', value: monitor, tone: 'text-warning-foreground' },
    { label: 'Issues', value: issue, tone: 'text-destructive' },
  ]

  return (
    <main>
      <PageHeader
        title="Field Maps"
        description="Geospatial view of every monitored parcel and its live health status."
        actions={<UploadButton />}
      />

      <div className="space-y-6 p-6 lg:p-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map((s) => (
            <Card key={s.label} className="p-4">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={`mt-1 text-2xl font-semibold ${s.tone ?? 'text-foreground'}`}>
                {s.value}
              </p>
            </Card>
          ))}
        </div>

        <Card className="p-5">
          <FieldMap />
        </Card>
      </div>
    </main>
  )
}
