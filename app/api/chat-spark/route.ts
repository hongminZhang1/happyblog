import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// 讯飞星火HTTP API配置
const SPARK_API_CONFIG = {
  apiPassword: process.env.SPARK_API_PASSWORD!,
  apiUrl: 'https://spark-api-open.xf-yun.com/v1/chat/completions',
  model: 'pro',
}

export async function POST(request: NextRequest) {
  try {
    // 检查环境变量
    if (!SPARK_API_CONFIG.apiPassword) {
      return NextResponse.json(
        { error: '缺少SPARK_API_PASSWORD环境变量，请在控制台获取APIPassword并配置' },
        { status: 500 },
      )
    }

    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: '无效的消息格式' }, { status: 400 })
    }

    // 构造请求体
    const requestBody = {
      model: SPARK_API_CONFIG.model,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      stream: false,
      temperature: 0.7,
      max_tokens: 2048,
      user: `user_${Date.now()}`,
    }

    // 调用讯飞星火HTTP API
    const response = await fetch(SPARK_API_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SPARK_API_CONFIG.apiPassword}`,
        'User-Agent': 'HappyBlog/1.0',
      },
      body: JSON.stringify(requestBody),
    })

    const responseText = await response.text()

    if (!response.ok) {
      let errorMessage = '讯飞星火API请求失败'

      try {
        const errorData = JSON.parse(responseText)
        errorMessage = errorData.error?.message || errorData.message || errorMessage

        // 特殊处理认证错误
        if (errorMessage.includes('AppIdNoAuthError') || errorData.error?.code === '11200') {
          errorMessage = '认证失败：请检查APIPassword是否正确，或者服务是否已正确开通'
        }
      }
      catch {
        errorMessage = responseText || errorMessage
      }

      return NextResponse.json(
        { error: `讯飞星火API错误: ${errorMessage}` },
        { status: response.status },
      )
    }

    let data
    try {
      data = JSON.parse(responseText)
    }
    catch {
      return NextResponse.json(
        { error: '讯飞星火API响应格式错误' },
        { status: 500 },
      )
    }

    // 检查响应格式
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return NextResponse.json(
        { error: '讯飞星火API返回格式异常' },
        { status: 500 },
      )
    }

    // 返回标准格式的响应
    return NextResponse.json({
      content: data.choices[0].message.content,
      timestamp: new Date().toISOString(),
      model: SPARK_API_CONFIG.model,
      usage: data.usage,
    })
  }
  catch (error) {
    return NextResponse.json(
      { error: `讯飞星火API错误: ${error instanceof Error ? error.message : '未知错误'}` },
      { status: 500 },
    )
  }
}
