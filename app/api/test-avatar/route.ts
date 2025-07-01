import type { NextRequest } from 'next/server'

export async function GET(_request: NextRequest) {
  const avatarUrl = 'https://blog-cos-1329880583.cos.ap-hongkong.myqcloud.com/config/avatar.jpg'

  try {
    // 测试头像链接是否可访问
    const response = await fetch(avatarUrl, {
      method: 'HEAD', // 只获取头部信息，不下载整个文件
    })

    if (response.ok) {
      return new Response(JSON.stringify({
        status: 'success',
        message: '头像链接可正常访问',
        url: avatarUrl,
        statusCode: response.status,
        contentType: response.headers.get('Content-Type'),
        lastModified: response.headers.get('Last-Modified'),
        contentLength: response.headers.get('Content-Length'),
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    else {
      return new Response(JSON.stringify({
        status: 'error',
        message: '头像链接访问失败',
        url: avatarUrl,
        statusCode: response.status,
        statusText: response.statusText,
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  }
  catch (error) {
    return new Response(JSON.stringify({
      status: 'error',
      message: '请求失败',
      url: avatarUrl,
      error: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
