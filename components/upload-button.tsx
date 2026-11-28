'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, Loader2, Check } from 'lucide-react'

export function UploadButton({
  onFileSelected,
}: {
  onFileSelected?: (fileName: string, previewUrl: string, file: File, pathname: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [state, setState] = useState<'idle' | 'uploading' | 'done'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function handleFiles(files: FileList | null) {
    const file = files?.[0]
    if (!file) return

    setError(null)
    setState('uploading')

    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await fetch('/api/blob-upload', {
        method: 'POST',
        body: formData,
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error ?? 'Could not upload the image.')
      }

      setState('done')
      onFileSelected?.(file.name, URL.createObjectURL(file), file, result.pathname)
      window.setTimeout(() => setState('idle'), 2500)
    } catch (cause) {
      setState('idle')
      setError(cause instanceof Error ? cause.message : 'Could not upload the image.')
    } finally {
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        aria-label="Select a drone image"
        className="sr-only"
        onChange={(event) => void handleFiles(event.target.files)}
      />
      <Button
        onClick={() => inputRef.current?.click()}
        disabled={state === 'uploading'}
        className="gap-2"
      >
        {state === 'uploading' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Saving to Blob…
          </>
        ) : state === 'done' ? (
          <>
            <Check className="h-4 w-4" /> Saved to Blob
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" /> Upload New Drone Photo
          </>
        )}
      </Button>
      {error && <p role="alert" className="max-w-64 text-xs text-destructive">{error}</p>}
    </div>
  )
}
