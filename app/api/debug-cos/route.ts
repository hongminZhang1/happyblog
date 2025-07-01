import { NextRequest, NextResponse } from 'next/server'
import { noPermission } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // 权限检查
    if (await noPermission()) {
      return NextResponse.json({ error: '权限不够~' }, { status: 401 })
    }

    // 收集环境变量信息
    const config = {
      secretId: process.env.TENCENT_COS_SECRET_ID ? '已配置 ✅' : '未配置 ❌',
      secretKey: process.env.TENCENT_COS_SECRET_KEY ? '已配置 ✅' : '未配置 ❌',
      region: process.env.TENCENT_COS_REGION || '未配置 ❌',
      bucket: process.env.TENCENT_COS_BUCKET || '未配置 ❌',
      domain: process.env.TENCENT_COS_DOMAIN || '未配置 ❌',
    }

    // 生成示例URL来测试格式
    const exampleFileName = 'blog-images/test-image.jpg'
    const exampleUrl = process.env.TENCENT_COS_DOMAIN 
      ? `${process.env.TENCENT_COS_DOMAIN}/${exampleFileName}`
      : '域名未配置'

    // 从域名中提取主机名（用于Next.js配置）
    let hostname = ''
    try {
      if (process.env.TENCENT_COS_DOMAIN) {
        const url = new URL(process.env.TENCENT_COS_DOMAIN)
        hostname = url.hostname
      }
    } catch (e) {
      hostname = '域名格式错误'
    }

    // 测试已上传的图片
    const testImages = [
      'https://blog-images-1364042782.cos.ap-guangzhou.myqcloud.com/blog-images/1751343341423_4wspsl8y6tc.jpg', // 新上传的英文文件名
      'https://blog-images-1364042782.cos.ap-guangzhou.myqcloud.com/blog-images/红色巨人.jpg' // 原有的中文文件名
    ]

    const imageTests = []
    for (const imageUrl of testImages) {
      try {
        const response = await fetch(imageUrl, { method: 'HEAD' })
        const contentDisposition = response.headers.get('content-disposition')
        const contentType = response.headers.get('content-type')
        
        imageTests.push({
          url: imageUrl,
          status: response.status,
          contentType,
          contentDisposition,
          canPreview: !contentDisposition || !contentDisposition.includes('attachment'),
          fileName: imageUrl.split('/').pop()
        })
      } catch (error) {
        imageTests.push({
          url: imageUrl,
          error: error instanceof Error ? error.message : '测试失败',
          fileName: imageUrl.split('/').pop()
        })
      }
    }

    return NextResponse.json({
      环境变量配置: config,
      示例图片URL: exampleUrl,
      提取的主机名: hostname,
      Next_js配置建议: {
        当前配置: '已添加具体域名 ✅',
        建议配置: hostname || '需要具体的域名',
        说明: 'Next.js配置已更新，支持您的COS域名'
      },
      图片预览测试: imageTests,
      解决方案: {
        问题: '图片下载而不是预览',
        原因: 'COS默认可能设置Content-Disposition为attachment',
        修复: '已在上传时设置ContentDisposition为inline',
        注意: '只对新上传的图片生效，旧图片需要重新上传'
      },
      调试步骤: [
        '1. 新上传一张图片测试预览功能',
        '2. 检查上述图片测试结果中的contentDisposition字段',
        '3. 如果新图片仍然下载，检查存储桶CORS设置',
        '4. 确认图片在Markdown编辑器和前端正常显示'
      ]
    })

  } catch (error) {
    console.error('调试错误:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : '调试失败' 
    }, { status: 500 })
  }
} 