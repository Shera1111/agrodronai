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
