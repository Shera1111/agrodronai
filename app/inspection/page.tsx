'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/page-header'
import { DetectionViewer } from '@/components/vision/detection-viewer'
import { ResultsPanel } from '@/components/vision/results-panel'
import { UploadButton } from '@/components/upload-button'

export default function InspectionPage() {
  const [active, setActive] = useState<string | null>(null)

  return (
    <main>
      <PageHeader
        title="Drone Inspection"
        description="AI Vision analysis of the latest captured field imagery."
        actions={<UploadButton />}
      />

      <div className="grid gap-6 p-6 lg:grid-cols-[1fr_360px] lg:p-8">
        <DetectionViewer active={active} onHover={setActive} />
        <ResultsPanel active={active} onHover={setActive} />
      </div>
    </main>
  )
}
