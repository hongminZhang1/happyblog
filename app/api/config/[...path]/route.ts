import type { NextRequest } from 'next/server'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    const resolvedParams = await params
    const filePath = join(process.cwd(), 'config', ...resolvedParams.path)
    const fileBuffer = await readFile(filePath)

    // 根据文件扩展名设置正确的 Content-Type
    const ext = resolvedParams.path[resolvedParams.path.length - 1]?.split('.').pop()?.toLowerCase()
    let contentType = 'application/octet-stream'

    switch (ext) {
      case 'png':
        contentType = 'image/png'
        break
      case 'jpg':
      case 'jpeg':
        contentType = 'image/jpeg'
        break
      case 'gif':
        contentType = 'image/gif'
        break
      case 'svg':
        contentType = 'image/svg+xml'
        break
      case 'webp':
        contentType = 'image/webp'
        break
    }

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  }
  catch {
    return new NextResponse('File not found', { status: 404 })
  }
}
