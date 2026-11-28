'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/page-header'
import { Card } from '@/components/ui/card'

type Scenario = 'corrections' | 'local_weed'
const STORAGE_KEY = 'agro-training-url'

export default function FineTuningPage() {
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setAddress(localStorage.getItem(STORAGE_KEY) || '')
  }, [])

  function openTraining(scenario: Scenario) {
    try {
      const url = new URL(address.trim())
      if (url.protocol !== 'https:' || !url.hostname) {
        throw new Error('Вставь действующий HTTPS-адрес демо.')
      }
      localStorage.setItem(STORAGE_KEY, url.origin)
      setError('')
      const destination = new URL('/training', url.origin)
      destination.searchParams.set('scenario', scenario)
      window.location.assign(destination.href)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Проверь адрес демо.')
    }
  }

  return (
    <main>
      <PageHeader title="Дообучение модели"
        description="Выбери способ адаптации модели под своё поле. Обучение выполняется на твоём компьютере." />
      <div className="space-y-6 p-6 lg:p-8">
        <Card className="space-y-3 p-5">
          <label htmlFor="training-url" className="text-sm font-medium">Адрес рабочего пространства</label>
          <input id="training-url" type="url" value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="https://...trycloudflare.com"
            className="w-full rounded-md border border-border bg-background px-3 py-2" />
          <p className="text-sm text-muted-foreground">
            Запусти start_online_demo.cmd и вставь адрес из dataset_upload/online_demo/address.txt.
            После перезапуска он может измениться.
          </p>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="flex flex-col gap-4 p-5">
            <h2 className="text-lg font-semibold">1. Исправить ошибки модели</h2>
            <p className="flex-1 text-sm text-muted-foreground">
              Агроном удаляет ложные рамки и отмечает пропущенные сорняки.
              Система обучает отдельную версию и сравнивает обе модели на проверочных снимках.
            </p>
            <button type="button" onClick={() => openTraining('corrections')}
              className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground">
              Исправить разметку и обучить
            </button>
          </Card>

          <Card className="flex flex-col gap-4 p-5">
            <h2 className="text-lg font-semibold">2. Добавить местный сорняк</h2>
            <p className="flex-1 text-sm text-muted-foreground">
              Загрузи снимки выбранного растения из своей местности и разметь его.
              Для первого опыта нужны минимум 10 обучающих снимков, 2 отдельных проверочных
              и снимок поля без этого сорняка. Результат проверяется на новых фото.
            </p>
            <button type="button" onClick={() => openTraining('local_weed')}
              className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground">
              Обучить местный сорняк
            </button>
          </Card>
        </div>
        <p className="text-sm text-muted-foreground">
          Режимы анализа «больше находок» и «меньше ложных рамок» меняют порог поиска.
          Оба сценария выше создают новую версию модели. Количество снимков не гарантирует точность.
        </p>
      </div>
    </main>
  )
}
