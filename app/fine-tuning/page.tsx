'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/page-header'
import { Card } from '@/components/ui/card'

const STORAGE_KEY = 'agro-training-url'

export default function FineTuningPage() {
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setAddress(localStorage.getItem(STORAGE_KEY) || '')
  }, [])

  function openTraining() {
    try {
      const url = new URL(address.trim())
      if (url.protocol !== 'https:') {
        throw new Error('Вставь HTTPS-адрес рабочего демо.')
      }

      localStorage.setItem(STORAGE_KEY, url.origin)
      setError('')
      window.location.assign(new URL('/training', url.origin).href)
    } catch {
      setError('Проверь HTTPS-адрес рабочего демо.')
    }
  }

  return (
    <main>
      <PageHeader
        title="Дообучение модели"
        description="Обучите отдельную версию для местного сорняка и сравните её с исходной."
      />

      <div className="space-y-6 p-6 lg:p-8">
        <Card className="space-y-4 p-5">
          <h2 className="text-lg font-semibold">Открыть рабочее пространство</h2>
          <p className="text-sm text-muted-foreground">
            Запусти start_online_demo.cmd на компьютере с моделью.
            Скопируй HTTPS-адрес из dataset_upload/online_demo/address.txt
            и вставь его ниже. После перезапуска демо адрес может измениться.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="url"
              aria-label="Адрес рабочего демо"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="https://...trycloudflare.com"
              className="min-w-0 flex-1 rounded-md border border-border bg-background px-3 py-2"
            />
            <button
              type="button"
              onClick={openTraining}
              className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground"
            >
              Открыть дообучение
            </button>
          </div>

          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        </Card>

        <Card className="space-y-3 p-5">
          <h2 className="text-lg font-semibold">Местный сорняк</h2>
          <p className="text-sm text-muted-foreground">
            В рабочем пространстве выбери сценарий «Местный сорняк по новым
            примерам». Разметь минимум 10 снимков для обучения, 2 отдельных
            снимка для проверки и один снимок поля без этого сорняка.
            Затем запусти обучение и сравни пропуски и лишние рамки двух моделей.
          </p>
          <p className="text-sm text-muted-foreground">
            Это минимальный набор для эксперимента, а не гарантия точности.
          </p>
        </Card>
      </div>
    </main>
  )
}