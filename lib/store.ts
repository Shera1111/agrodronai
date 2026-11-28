'use client'

import { useEffect, useState } from 'react'
import type { Detection } from '@/lib/data'

// Хранилище результатов анализа в браузере (localStorage).
// Данные лежат только в том браузере, где выполнялся анализ, это не база данных.

export type StoredDetection = {
  confidence: number
  risk: Detection['risk']
  box: Detection['box'] // проценты от размера снимка
}

export type AnalysisRecord = {
  id: string
  fileName: string
  analyzedAt: string // ISO-дата
  width: number
  height: number
  weeds: number
  maxConfidence: number
  avgConfidence: number
  high: number
  medium: number
  low: number
  detections: StoredDetection[]
}

const KEY = 'agrodrone.analyses.v1'
const EVENT = 'agrodrone:analyses-changed'
const MAX_RECORDS = 50

export function loadAnalyses(): AnalysisRecord[] {
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as AnalysisRecord[]) : []
  } catch {
    return []
  }
}

export function saveAnalysis(record: AnalysisRecord): void {
  try {
    const next = [record, ...loadAnalyses()].slice(0, MAX_RECORDS)
    window.localStorage.setItem(KEY, JSON.stringify(next))
    window.dispatchEvent(new Event(EVENT))
  } catch {
    // Хранилище может быть недоступно или переполнено: тогда просто не сохраняем.
  }
}

export function clearAnalyses(): void {
  try {
    window.localStorage.removeItem(KEY)
    window.dispatchEvent(new Event(EVENT))
  } catch {
    // ничего не делаем
  }
}

export function buildRecord(
  fileName: string,
  width: number,
  height: number,
  list: Detection[],
): AnalysisRecord {
  const conf = list.map((d) => d.confidence)
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    fileName,
    analyzedAt: new Date().toISOString(),
    width,
    height,
    weeds: list.length,
    maxConfidence: conf.length ? Math.max(...conf) : 0,
    avgConfidence: conf.length ? Math.round(conf.reduce((a, b) => a + b, 0) / conf.length) : 0,
    high: list.filter((d) => d.risk === 'high').length,
    medium: list.filter((d) => d.risk === 'medium').length,
    low: list.filter((d) => d.risk === 'low').length,
    detections: list.map((d) => ({ confidence: d.confidence, risk: d.risk, box: d.box })),
  }
}

export function useAnalyses(): { records: AnalysisRecord[]; ready: boolean } {
  const [records, setRecords] = useState<AnalysisRecord[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const refresh = () => {
      setRecords(loadAnalyses())
      setReady(true)
    }
    refresh()
    window.addEventListener(EVENT, refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener(EVENT, refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  return { records, ready }
}