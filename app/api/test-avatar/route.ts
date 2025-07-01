import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // 测试图片URL
  const testImageUrl = 'https://blog-images-1364042782.cos.ap-guangzhou.myqcloud.com/blog-images/红色巨人.jpg'
  
  try {
    // 尝试fetch图片
    const response = await fetch(testImageUrl, {
      method: 'HEAD', // 只获取头信息，不下载图片内容
    })
    
    return NextResponse.json({
      success: true,
      status: response.status,
      statusText: response.statusText,
      headers: {
        'content-type': response.headers.get('content-type'),
        'content-length': response.headers.get('content-length'),
        'last-modified': response.headers.get('last-modified'),
      },
      message: '图片URL可以正常访问',
      testUrl: testImageUrl,
      nextJsConfig: {
        message: '请确保重启开发服务器以应用新的配置',
        domain: 'blog-images-1364042782.cos.ap-guangzhou.myqcloud.com',
      }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
      message: '图片URL无法访问',
      testUrl: testImageUrl,
      troubleshooting: [
        '1. 检查存储桶权限是否设置为"公有读私有写"',
        '2. 检查COS域名配置是否正确',
        '3. 检查网络连接',
        '4. 检查图片文件是否真实存在'
      ]
    }, { status: 500 })
  }
} 