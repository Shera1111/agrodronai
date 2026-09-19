import { NextResponse } from 'next/server'

const BACKEND_URL =
  'https://us-central1-agro-drone-ai-2026.cloudfunctions.net/analyze-crop-health'

export async function POST(request: Request) {
  let imageName: string | undefined

  try {
    const body = await request.json()
    imageName = body?.image_name
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  if (!imageName || typeof imageName !== 'string') {
    return NextResponse.json(
      { error: 'image_name is required.' },
      { status: 400 },
    )
  }

  try {
    const upstream = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_name: imageName }),
      // don't cache analysis results
      cache: 'no-store',
    })

    const text = await upstream.text()
    let data: unknown
    try {
      data = JSON.parse(text)
    } catch {
      data = { raw: text }
    }

    if (!upstream.ok) {
      return NextResponse.json(
        { error: 'Backend analysis failed.', status: upstream.status, data },
        { status: 502 },
      )
    }

    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json(
      {
        error: 'Could not reach the analysis backend.',
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 502 },
    )
  }
}
