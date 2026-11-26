'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { PageHeader } from '@/components/page-header'
import { DetectionViewer } from '@/components/vision/detection-viewer'
import { ResultsPanel } from '@/components/vision/results-panel'
import { UploadButton } from '@/components/upload-button'
import {
  mapYoloToDetections,
  summarizeDetections,
  type Detection,
  type YoloResponse,
} from '@/lib/data'

const BACKEND_URL = 'https://agro-drone-backend.onrender.com/'

async function analyzeFetcher([, file]: [string, File]): Promise<YoloResponse> {
  const form = new FormData()
  form.append('image', file)
  const res = await fetch(BACKEND_URL, { method: 'POST', body: form })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data?.error ?? 'Analysis request failed.')
  }
  return data as YoloResponse
}

export default function InspectionPage() {
  const [active, setActive] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined)
  const [blobPathname, setBlobPathname] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith('blob:')) URL.revokeObjectURL(imagePreview)
    }
  }, [imagePreview])

  const { data, error, isLoading } = useSWR(
    file ? (['analyze', file] as [string, File]) : null,
    analyzeFetcher,
    { revalidateOnFocus: false, shouldRetryOnError: false },
  )

  function handleFileSelected(_name: string, previewUrl: string, selected: File, pathname: string) {
    setImagePreview(previewUrl)
    setFile(selected)
    setBlobPathname(pathname)
  }

  const detections: Detection[] = data ? mapYoloToDetections(data) : []
  const storageNote = blobPathname ? ' · saved to private Blob storage' : ''
  const subtitle = data
    ? `${file?.name} · ${data.detections_count} detections · ${data.image_size.width}×${data.image_size.height}px${storageNote}`
    : isLoading
      ? `Analyzing with the YOLO model… (first request can take about a minute)${storageNote}`
      : 'Upload a drone photo to start analysis'

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
          cropType={undefined}
          summary={data ? summarizeDetections(detections) : undefined}
          loading={isLoading}
          error={error ? (error as Error).message : null}
        />
      </div>
    </main>
  )
}
