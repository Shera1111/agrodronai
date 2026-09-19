export type FieldStatus = 'healthy' | 'issue' | 'monitor'

export type Field = {
  id: string
  name: string
  crop: string
  acres: number
  status: FieldStatus
  health: number
  lastScan: string
  // grid position (percentage) for the map layout
  x: number
  y: number
  note: string
}

export const fields: Field[] = [
  { id: 'F-01', name: 'North Ridge', crop: 'Corn', acres: 142, status: 'healthy', health: 96, lastScan: '2h ago', x: 18, y: 22, note: 'Uniform canopy, no anomalies.' },
  { id: 'F-02', name: 'Willow Creek', crop: 'Soybean', acres: 88, status: 'issue', health: 61, lastScan: '1h ago', x: 44, y: 30, note: 'Early blight cluster on east edge.' },
  { id: 'F-03', name: 'South Flats', crop: 'Wheat', acres: 210, status: 'healthy', health: 92, lastScan: '4h ago', x: 70, y: 24, note: 'Optimal growth stage.' },
  { id: 'F-04', name: 'Cedar Bend', crop: 'Corn', acres: 120, status: 'monitor', health: 78, lastScan: '3h ago', x: 28, y: 58, note: 'Minor weed pressure detected.' },
  { id: 'F-05', name: 'Maple Hollow', crop: 'Soybean', acres: 96, status: 'issue', health: 54, lastScan: '30m ago', x: 58, y: 64, note: 'Dandelion + aphid activity.' },
  { id: 'F-06', name: 'East Prairie', crop: 'Wheat', acres: 175, status: 'healthy', health: 89, lastScan: '5h ago', x: 82, y: 60, note: 'Stable, within thresholds.' },
]

export const summary = {
  fieldsAnalyzed: 831,
  fieldsDelta: '+42 this week',
  detections: 27,
  detectionsDelta: '9 high risk',
  healthScore: 84,
  healthDelta: '+3.2 vs last scan',
  actionRequired: 3,
  actionDelta: '2 fields critical',
}

export type Detection = {
  id: string
  label: string
  type?: string
  confidence: number
  risk: 'high' | 'medium' | 'low'
  recommendation: string
  // bounding box as percentages of the image
  box: { top: number; left: number; width: number; height: number }
}

export const detections: Detection[] = [
  {
    id: 'd1',
    label: 'Weed_Dandelion',
    confidence: 94,
    risk: 'medium',
    recommendation: 'Spot-spray selective herbicide within 48h to prevent seed spread.',
    box: { top: 30, left: 12, width: 22, height: 26 },
  },
  {
    id: 'd2',
    label: 'Early_Blight',
    confidence: 88,
    risk: 'high',
    recommendation: 'Apply chlorothalonil fungicide to affected zone; re-scan in 3 days.',
    box: { top: 52, left: 58, width: 26, height: 24 },
  },
  {
    id: 'd3',
    label: 'Nutrient_Deficiency',
    confidence: 72,
    risk: 'low',
    recommendation: 'Schedule soil test; consider nitrogen top-dressing next cycle.',
    box: { top: 14, left: 62, width: 18, height: 18 },
  },
]

// ---- Backend API (analyze-crop-health) ----

export type ApiDetection = {
  id: string | number
  label: string
  type: string
  severity: string
  recommended_action: string
  confidence: number
  bounding_box: number[] | { x?: number; y?: number; top?: number; left?: number; width?: number; height?: number }
}

export type AnalysisSummary = {
  critical_issues?: number
  medium_issues?: number
  low_issues?: number
  requires_immediate_action?: boolean
  overall_field_status?: string
}

export type AnalysisResponse = {
  status: string
  processed_file: string
  crop_type: string
  summary: string | AnalysisSummary
  total_issues_found: number
  detections: ApiDetection[]
}

function normalizeRisk(severity: string): Detection['risk'] {
  const s = (severity ?? '').toString().toLowerCase()
  if (['high', 'critical', 'severe', 'danger'].some((k) => s.includes(k))) return 'high'
  if (['medium', 'moderate', 'warning', 'monitor'].some((k) => s.includes(k))) return 'medium'
  return 'low'
}

function normalizeConfidence(confidence: number): number {
  if (confidence == null || Number.isNaN(confidence)) return 0
  // accept either 0-1 or 0-100 scales
  const pct = confidence <= 1 ? confidence * 100 : confidence
  return Math.round(Math.min(100, Math.max(0, pct)))
}

function normalizeBox(bb: ApiDetection['bounding_box']): Detection['box'] {
  let top = 0
  let left = 0
  let width = 0
  let height = 0

  if (Array.isArray(bb)) {
    // [x, y, width, height]
    ;[left, top, width, height] = [bb[0] ?? 0, bb[1] ?? 0, bb[2] ?? 0, bb[3] ?? 0]
  } else if (bb && typeof bb === 'object') {
    left = bb.left ?? bb.x ?? 0
    top = bb.top ?? bb.y ?? 0
    width = bb.width ?? 0
    height = bb.height ?? 0
  }

  // if values look normalized (0-1), scale to percentages
  const scale = (v: number) => (Math.abs(v) <= 1 ? v * 100 : v)
  return {
    top: scale(top),
    left: scale(left),
    width: scale(width),
    height: scale(height),
  }
}

export function mapAnalysisToDetections(res: AnalysisResponse): Detection[] {
  if (!res?.detections?.length) return []
  return res.detections.map((d, i) => ({
    id: String(d.id ?? `d${i + 1}`),
    label: d.label,
    type: d.type,
    confidence: normalizeConfidence(d.confidence),
    risk: normalizeRisk(d.severity),
    recommendation: d.recommended_action,
    box: normalizeBox(d.bounding_box),
  }))
}

export const reports = [
  { id: 'R-2048', field: 'Maple Hollow', type: 'Disease Scan', date: 'Sep 12, 2026', status: 'Action Required', findings: 'Early blight, aphids' },
  { id: 'R-2047', field: 'North Ridge', type: 'Health Survey', date: 'Sep 12, 2026', status: 'Clear', findings: 'No anomalies' },
  { id: 'R-2046', field: 'Willow Creek', type: 'Disease Scan', date: 'Sep 11, 2026', status: 'Action Required', findings: 'Early blight cluster' },
  { id: 'R-2045', field: 'Cedar Bend', type: 'Weed Detection', date: 'Sep 11, 2026', status: 'Monitor', findings: 'Low weed pressure' },
  { id: 'R-2044', field: 'South Flats', type: 'Health Survey', date: 'Sep 10, 2026', status: 'Clear', findings: 'Optimal growth' },
  { id: 'R-2043', field: 'East Prairie', type: 'Yield Estimate', date: 'Sep 10, 2026', status: 'Clear', findings: '+4% vs forecast' },
]

export const statusStyles: Record<FieldStatus, { dot: string; label: string; badge: string }> = {
  healthy: { dot: 'bg-primary', label: 'Healthy', badge: 'bg-primary/10 text-primary border-primary/20' },
  monitor: { dot: 'bg-warning', label: 'Monitor', badge: 'bg-warning/15 text-warning-foreground border-warning/30' },
  issue: { dot: 'bg-destructive', label: 'Issue Detected', badge: 'bg-destructive/10 text-destructive border-destructive/20' },
}
