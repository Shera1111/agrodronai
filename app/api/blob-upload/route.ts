import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'

const MAX_UPLOAD_BYTES = 4 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const FILE_EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

export async function POST(request: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: 'Blob storage is not configured for this deployment.' },
      { status: 503 },
    )
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid upload request.' }, { status: 400 })
  }

  const file = formData.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Choose an image to upload.' }, { status: 400 })
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: 'Upload a JPEG, PNG, or WebP image.' },
      { status: 415 },
    )
  }

  if (file.size === 0 || file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { error: 'Image must be smaller than 4 MB.' },
      { status: 413 },
    )
  }

  try {
    const pathname = `drone-uploads/${crypto.randomUUID()}.${FILE_EXTENSIONS[file.type]}`
    const blob = await put(pathname, file, {
      access: 'private',
      contentType: file.type,
    })

    return NextResponse.json({ pathname: blob.pathname })
  } catch (error) {
    console.error('Blob upload failed:', error)
    return NextResponse.json(
      { error: 'Could not save the image to Blob storage.' },
      { status: 500 },
    )
  }
}
