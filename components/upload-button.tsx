'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, Loader2, Check } from 'lucide-react'

export function UploadButton() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [state, setState] = useState<'idle' | 'uploading' | 'done'>('idle')

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setState('uploading')
    setTimeout(() => {
      setState('done')
      setTimeout(() => setState('idle'), 2500)
    }, 1600)
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <Button
        onClick={() => inputRef.current?.click()}
        disabled={state === 'uploading'}
        className="gap-2"
      >
        {state === 'uploading' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Analyzing…
          </>
        ) : state === 'done' ? (
          <>
            <Check className="h-4 w-4" /> Uploaded
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" /> Upload New Drone Photo
          </>
        )}
      </Button>
    </>
  )
}
