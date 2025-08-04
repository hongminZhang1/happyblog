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

    const body = await request.json()
    const { messages, stream = false } = body

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
      stream,
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

    if (!response.ok) {
      const responseText = await response.text()
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

    // 如果是流式响应，返回流
    if (stream) {
      const encoder = new TextEncoder()

      const readable = new ReadableStream({
        async start(controller) {
          const reader = response.body?.getReader()
          if (!reader) {
            controller.close()
            return
          }

          try {
            while (true) {
              const { done, value } = await reader.read()
              if (done)
                break

              // 解析SSE数据
              const chunk = new TextDecoder().decode(value)
              const lines = chunk.split('\n')

              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  const data = line.slice(6)
                  if (data === '[DONE]') {
                    controller.close()
                    return
                  }

                  try {
                    const parsed = JSON.parse(data)
                    if (parsed.choices?.[0]?.delta?.content) {
                      // 发送流式数据给前端
                      const streamData = JSON.stringify({
                        content: parsed.choices[0].delta.content,
                        done: false,
                      })
                      controller.enqueue(encoder.encode(`data: ${streamData}\n\n`))
                    }
                  }
                  catch (e) {
                    // 忽略解析错误
                  }
                }
              }
            }
          }
          catch (error) {
            controller.error(error)
          }
          finally {
            reader.releaseLock()
            controller.close()
          }
        },
      })

      return new Response(readable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      })
    }

    // 非流式响应处理
    const responseText = await response.text()

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
