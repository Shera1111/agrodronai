import { PageHeader } from '@/components/page-header'
import { Trainer } from '@/components/fine-tuning/trainer'
import { Card } from '@/components/ui/card'

const models = [
  { name: 'Palmer_Amaranth', images: 18, accuracy: '96.4%', status: 'Deployed' },
  { name: 'Canada_Thistle', images: 16, accuracy: '93.1%', status: 'Deployed' },
  { name: 'Waterhemp', images: 20, accuracy: '91.8%', status: 'Training' },
]

export default function FineTuningPage() {
  return (
    <main>
      <PageHeader
        title="Custom AI Fine-Tuning"
        description="Teach the vision model to recognize weeds specific to your region."
      />

      <div className="space-y-6 p-6 lg:p-8">
        <Card className="p-5">
          <h2 className="text-base font-semibold text-foreground">Train a new class</h2>
          <p className="mb-5 text-sm text-muted-foreground">
            Upload 15–20 labeled images of a single weed for best results.
          </p>
          <Trainer />
        </Card>

        <Card className="p-5">
          <h2 className="text-base font-semibold text-foreground">Your custom models</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="pb-2 font-medium">Class</th>
                  <th className="pb-2 font-medium">Images</th>
                  <th className="pb-2 font-medium">Accuracy</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {models.map((m) => (
                  <tr key={m.name} className="border-b border-border last:border-0">
                    <td className="py-3 font-mono font-medium text-foreground">{m.name}</td>
                    <td className="py-3 text-muted-foreground">{m.images}</td>
                    <td className="py-3 text-muted-foreground">{m.accuracy}</td>
                    <td className="py-3">
                      <span
                        className={
                          m.status === 'Deployed'
                            ? 'rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary'
                            : 'rounded-full border border-warning/30 bg-warning/15 px-2 py-0.5 text-xs font-medium text-warning-foreground'
                        }
                      >
                        {m.status}
                      </span>
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
