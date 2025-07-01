import type { NextRequest } from 'next/server'

import { auth } from '@/auth'
import { isValidFileSize, isValidImageType, uploadToCOS } from '@/lib/cos'

export async function POST(request: NextRequest) {
  try {
    // 检查用户认证
    const session = await auth()
    if (!session) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 },
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return Response.json(
        { error: 'No file uploaded' },
        { status: 400 },
      )
    }

    // 验证文件类型
    if (!isValidImageType(file.name)) {
      return Response.json(
        { error: 'Invalid file type. Only images are allowed.' },
        { status: 400 },
      )
    }

    // 验证文件大小
    if (!isValidFileSize(file.size)) {
      return Response.json(
        { error: 'File too large. Maximum size is 4MB.' },
        { status: 400 },
      )
    }

    // 将文件转换为Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // 上传到COS
    const imageUrl = await uploadToCOS(buffer, file.name)

    return Response.json({
      url: imageUrl,
      filename: file.name,
      size: file.size,
    })
  }
  catch (error) {
    console.error('Upload error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
