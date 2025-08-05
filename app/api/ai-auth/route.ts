import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    // 从环境变量获取密码
    const correctPassword = process.env.AI_PWD

    if (!correctPassword) {
      return NextResponse.json(
        { error: 'AI密码未配置' },
        { status: 500 },
      )
    }

    if (password === correctPassword) {
      return NextResponse.json({ success: true })
    }
    else {
      return NextResponse.json(
        { error: '密码错误' },
        { status: 401 },
      )
    }
  }
  catch {
    return NextResponse.json(
      { error: '请求格式错误' },
      { status: 400 },
    )
  }
}
