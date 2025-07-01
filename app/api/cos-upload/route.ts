import { noPermission } from '@/lib/auth'
import { uploadToCOS, isValidImageType, isValidFileSize } from '@/lib/cos'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // 权限检查
    if (await noPermission()) {
      return NextResponse.json({ error: '权限不够~' }, { status: 401 })
    }

    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json({ error: '没有找到文件' }, { status: 400 })
    }

    // 验证文件类型
    if (!isValidImageType(file.name)) {
      return NextResponse.json({ error: '只允许上传图片文件' }, { status: 400 })
    }

    // 验证文件大小
    if (!isValidFileSize(file.size)) {
      return NextResponse.json({ error: '文件大小不能超过 4MB' }, { status: 400 })
    }

    // 转换文件为Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // 上传到COS
    const fileUrl = await uploadToCOS(buffer, file.name)

    return NextResponse.json({
      url: fileUrl,
      name: file.name,
      size: file.size,
    })

  } catch (error) {
    console.error('上传错误:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : '上传失败' 
    }, { status: 500 })
  }
} 