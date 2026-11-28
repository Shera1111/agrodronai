'use client'

import { useEffect, useRef, useState } from 'react'
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
import { buildRecord, saveAnalysis } from '@/lib/store'

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
  const savedKey = useRef<string | null>(null)

  const { data, error, isLoading } = useSWR(
    file ? (['analyze', file] as [string, File]) : null,
    analyzeFetcher,
    { revalidateOnFocus: false, shouldRetryOnError: false },
  )

  function handleFileSelected(_name: string, previewUrl: string, selected: File) {
    setImagePreview(previewUrl)
    setFile(selected)
  }

  const detections: Detection[] = data ? mapYoloToDetections(data) : []

  // Каждый успешный анализ сохраняем один раз (нужно для Reports, Dashboard и Field Maps).
  useEffect(() => {
    if (!data || !file) return
    const key = `${file.name}|${file.size}|${file.lastModified}`
    if (savedKey.current === key) return
    savedKey.current = key
    saveAnalysis(
      buildRecord(file.name, data.image_size.width, data.image_size.height, mapYoloToDetections(data)),
    )
  }, [data, file])

  const subtitle = data
    ? `${file?.name} · ${data.detections_count} detections · ${data.image_size.width}×${data.image_size.height}px`
    : isLoading
      ? 'Analyzing with the YOLO model… (first request can take about a minute)'
      : 'Upload a drone photo to start analysis'

  return (
    <main>
      <PageHeader
        title="Drone Inspection"
        description="AI Vision analysis of the uploaded field imagery."
        actions={<UploadButton onFileSelected={handleFileSelected} />}
      />

      <div className="grid gap-6 p-6 lg:grid-cols-[1fr_360px] lg:p-8">
        <DetectionViewer
          active={active}
          onHover={setActive}
          detections={detections}
          title={file ? 'Analyzed image' : 'No image selected'}
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