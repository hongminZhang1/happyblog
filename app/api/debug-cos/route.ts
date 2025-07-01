import type { NextRequest } from 'next/server'
import { noPermission } from '@/lib/auth'

export async function GET(_request: NextRequest) {
  try {
    // 验证管理员权限
    if (await noPermission()) {
      return new Response(JSON.stringify({
        error: 'Unauthorized',
        message: '需要管理员权限',
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // 检查环境变量
    const cosConfig = {
      hasSecretId: !!process.env.TENCENT_COS_SECRET_ID,
      hasSecretKey: !!process.env.TENCENT_COS_SECRET_KEY,
      bucket: process.env.TENCENT_COS_BUCKET || 'Not configured',
      region: process.env.TENCENT_COS_REGION || 'Not configured',
      domain: process.env.TENCENT_COS_DOMAIN || 'Not configured',
    }

    return new Response(JSON.stringify({
      status: 'COS Configuration Check',
      config: cosConfig,
      note: 'Secret keys are hidden for security',
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  catch (error) {
    return new Response(JSON.stringify({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export async function POST(_request: NextRequest) {
  try {
    // 验证管理员权限
    if (await noPermission()) {
      return new Response(JSON.stringify({
        error: 'Unauthorized',
        message: '需要管理员权限',
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // 测试用的小图片（1x1 PNG）
    const testImageBuffer = Buffer.from([
      0x89,
      0x50,
      0x4E,
      0x47,
      0x0D,
      0x0A,
      0x1A,
      0x0A,
      0x00,
      0x00,
      0x00,
      0x0D,
      0x49,
      0x48,
      0x44,
      0x52,
      0x00,
      0x00,
      0x00,
      0x01,
      0x00,
      0x00,
      0x00,
      0x01,
      0x08,
      0x02,
      0x00,
      0x00,
      0x00,
      0x90,
      0x77,
      0x53,
      0xDE,
      0x00,
      0x00,
      0x00,
      0x0C,
      0x49,
      0x44,
      0x41,
      0x54,
      0x78,
      0x9C,
      0x63,
      0xF8,
      0x00,
      0x00,
      0x00,
      0x01,
      0x00,
      0x01,
      0x02,
      0x00,
      0x00,
      0x00,
      0x04,
      0x00,
      0x00,
      0x00,
      0x00,
      0x49,
      0x45,
      0x4E,
      0x44,
      0xAE,
      0x42,
      0x60,
      0x82,
    ])

    const testFileName = `test-${Date.now()}.png`

    return new Response(JSON.stringify({
      status: 'Test image created',
      filename: testFileName,
      size: testImageBuffer.length,
      note: 'This is a 1x1 transparent PNG for testing',
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  catch (error) {
    return new Response(JSON.stringify({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
