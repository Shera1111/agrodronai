'use client'

import { useRef, useState, type DragEvent } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { UploadCloud, X, ImageIcon, Loader2, CheckCircle2 } from 'lucide-react'

type Sample = { id: string; name: string; url: string }

const MIN = 15
const MAX = 20

export function Trainer() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [samples, setSamples] = useState<Sample[]>([])
  const [dragging, setDragging] = useState(false)
  const [weedName, setWeedName] = useState('')
  const [status, setStatus] = useState<'idle' | 'training' | 'done'>('idle')

  function addFiles(files: FileList | null) {
    if (!files) return
    const next: Sample[] = Array.from(files)
      .filter((f) => f.type.startsWith('image/'))
      .map((f) => ({
        id: `${f.name}-${f.size}-${crypto.randomUUID()}`,
        name: f.name,
        url: URL.createObjectURL(f),
      }))
    setSamples((prev) => [...prev, ...next].slice(0, MAX))
    setStatus('idle')
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragging(false)
    addFiles(e.dataTransfer.files)
  }

  function removeSample(id: string) {
    setSamples((prev) => prev.filter((s) => s.id !== id))
  }

  function train() {
    setStatus('training')
    setTimeout(() => setStatus('done'), 2400)
  }

  const enough = samples.length >= MIN
  const canTrain = enough && weedName.trim().length > 0 && status !== 'training'

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
          }}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors',
            dragging
              ? 'border-primary bg-primary/5'
              : 'border-border bg-card hover:border-primary/50 hover:bg-muted/50',
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(e) => addFiles(e.target.files)}
          />
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <UploadCloud className="h-7 w-7 text-primary" />
          </div>
          <p className="mt-4 text-sm font-medium text-foreground">
            Drag &amp; drop weed images here
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            or click to browse · PNG or JPG · {MIN}–{MAX} images recommended
          </p>
        </div>

        {samples.length > 0 ? (
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">
                {samples.length} / {MAX} images
              </span>
              <button
                onClick={() => setSamples([])}
                className="text-xs text-muted-foreground hover:text-destructive"
              >
                Clear all
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
              {samples.map((s) => (
                <div
                  key={s.id}
                  className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.url} alt={s.name} className="h-full w-full object-cover" />
                  <button
                    onClick={() => removeSample(s.id)}
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-foreground/70 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label={`Remove ${s.name}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {/* config sidebar */}
      <div className="space-y-4 rounded-xl border border-border bg-card p-5">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Training configuration</h3>
          <p className="text-xs text-muted-foreground">
            Add a labeled class to the detection model.
          </p>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="weed-name" className="text-sm font-medium text-foreground">
            Custom weed / class name
          </label>
          <input
            id="weed-name"
            value={weedName}
            onChange={(e) => setWeedName(e.target.value)}
            placeholder="e.g. Palmer_Amaranth"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-2 rounded-lg bg-muted p-3 text-xs">
          <Check ok={enough} label={`${MIN}+ sample images`} />
          <Check ok={weedName.trim().length > 0} label="Class name provided" />
        </div>

        <Button onClick={train} disabled={!canTrain} className="w-full gap-2">
          {status === 'training' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Training model…
            </>
          ) : (
            <>
              <ImageIcon className="h-4 w-4" /> Train Model
            </>
          )}
        </Button>

        {status === 'done' ? (
          <div className="flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-foreground">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>
              <span className="font-semibold">{weedName || 'New class'}</span> queued for training on{' '}
              {samples.length} images. Estimated completion: ~18 min.
            </span>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function Check({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          'flex h-4 w-4 items-center justify-center rounded-full text-[10px] text-white',
          ok ? 'bg-primary' : 'bg-muted-foreground/40',
        )}
      >
        {ok ? '✓' : ''}
      </span>
      <span className={cn(ok ? 'text-foreground' : 'text-muted-foreground')}>{label}</span>
    </div>
  )
}
