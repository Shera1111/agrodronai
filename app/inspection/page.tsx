'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { PageHeader } from '@/components/page-header'
import { DetectionViewer } from '@/components/vision/detection-viewer'
import { ResultsPanel } from '@/components/vision/results-panel'
import { UploadButton } from '@/components/upload-button'
import {
  mapAnalysisToDetections,
  type AnalysisResponse,
  type Detection,
} from '@/lib/data'

const DEFAULT_IMAGE_NAME = 'field-aerial.jpg'

async function analyzeFetcher(imageName: string): Promise<AnalysisResponse> {
  const res = await fetch('/api/analyze-crop', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image_name: imageName }),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data?.error ?? 'Analysis request failed.')
  }
  return data as AnalysisResponse
}

export default function InspectionPage() {
  const [active, setActive] = useState<string | null>(null)
  const [imageName, setImageName] = useState<string>(DEFAULT_IMAGE_NAME)
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined)

  const { data, error, isLoading } = useSWR<AnalysisResponse>(
    imageName,
    analyzeFetcher,
    { revalidateOnFocus: false, shouldRetryOnError: false },
  )

  function handleFileSelected(fileName: string, previewUrl: string) {
    setImageName(fileName)
    setImagePreview(previewUrl)
  }

  const detections: Detection[] = data ? mapAnalysisToDetections(data) : []
  const subtitle = data
    ? `${data.processed_file} · ${data.total_issues_found} issues · status: ${data.status}`
    : isLoading
      ? 'Requesting analysis from backend…'
      : 'Awaiting analysis'

  return (
    <main>
      <PageHeader
        title="Drone Inspection"
        description="AI Vision analysis of the latest captured field imagery."
        actions={<UploadButton onFileSelected={handleFileSelected} />}
      />

      <div className="grid gap-6 p-6 lg:grid-cols-[1fr_360px] lg:p-8">
        <DetectionViewer
          active={active}
          onHover={setActive}
          detections={detections}
          title="Maple Hollow · Sector 4"
          subtitle={subtitle}
          loading={isLoading}
          imageSrc={imagePreview}
        />
        <ResultsPanel
          active={active}
          onHover={setActive}
          detections={detections}
          cropType={data?.crop_type}
          summary={data?.summary}
          loading={isLoading}
          error={error ? (error as Error).message : null}
        />
      </div>
    </main>
  )
}