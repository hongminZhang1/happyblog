import type { NextRequest } from 'next/server'
import crypto from 'node:crypto'
import { URL } from 'node:url'
import { NextResponse } from 'next/server'
import WebSocket from 'ws'

// 讯飞星火API配置 - Spark Pro版本
const SPARK_API_CONFIG = {
  appId: process.env.SPARK_APP_ID!,
  apiKey: process.env.SPARK_API_KEY!,
  apiSecret: process.env.SPARK_API_SECRET!,
  // 使用讯飞星火API Spark Pro的WebSocket地址
  hostUrl: 'wss://spark-api.xf-yun.com/v3.1/chat',
  domain: 'generalv3',
}

// 生成鉴权URL - Spark Pro版本
function getAuthUrl() {
  const { hostUrl, apiKey, apiSecret } = SPARK_API_CONFIG
  const url = new URL(hostUrl)
  const host = url.host
  const path = url.pathname

  // 生成RFC1123格式的时间戳
  const date = new Date().toUTCString()

  // 拼接待签名字符串 - 确保格式正确
  const signatureOrigin = `host: ${host}\ndate: ${date}\nGET ${path} HTTP/1.1`

  // 生成签名
  const signature = crypto.createHmac('sha256', apiSecret).update(signatureOrigin).digest('base64')

  // 生成authorization参数
  const authorizationOrigin = `api_key="${apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`
  const authorization = Buffer.from(authorizationOrigin).toString('base64')

  // 返回认证URL - 修复URL编码
  return `${hostUrl}?authorization=${encodeURIComponent(authorization)}&date=${encodeURIComponent(date)}&host=${encodeURIComponent(host)}`
}

export async function POST(request: NextRequest) {
  try {
    // 检查环境变量
    if (!SPARK_API_CONFIG.appId || !SPARK_API_CONFIG.apiKey || !SPARK_API_CONFIG.apiSecret) {
      return NextResponse.json({ error: '缺少必要的环境变量' }, { status: 500 })
    }

    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: '无效的消息格式' }, { status: 400 })
    }

    const response = await callSparkAPI(messages)

    return NextResponse.json({
      content: response,
      timestamp: new Date().toISOString(),
    })
  }
  catch (error) {
    return NextResponse.json(
      { error: `讯飞星火API错误: ${error instanceof Error ? error.message : '未知错误'}` },
      { status: 500 },
    )
  }
}

async function callSparkAPI(messages: any[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const authUrl = getAuthUrl()
    const ws = new WebSocket(authUrl)

    let response = ''
    let isResolved = false

    ws.on('open', () => {
      const requestMessage = {
        header: {
          app_id: SPARK_API_CONFIG.appId,
          uid: `user_${Date.now()}`,
        },
        parameter: {
          chat: {
            domain: SPARK_API_CONFIG.domain,
            temperature: 0.5,
            max_tokens: 2048,
          },
        },
        payload: {
          message: {
            text: [
              {
                role: 'user',
                content: messages[messages.length - 1].content,
              },
            ],
          },
        },
      }

      ws.send(JSON.stringify(requestMessage))
    })

    ws.on('message', (data) => {
      try {
        const result = JSON.parse(data.toString())

        if (result.header && result.header.code !== 0) {
          if (!isResolved) {
            isResolved = true
            reject(new Error(`API错误: ${result.header.message || result.header.code}`))
          }
          return
        }

        if (result.payload && result.payload.choices && result.payload.choices.text) {
          const text = result.payload.choices.text[0]
          if (text && text.content) {
            response += text.content
          }
        }

        if (result.header && result.header.status === 2) {
          ws.close()
          if (!isResolved) {
            isResolved = true
            resolve(response || '无响应内容')
          }
        }
      }
      catch (error) {
        if (!isResolved) {
          isResolved = true
          reject(new Error(`解析响应失败: ${error instanceof Error ? error.message : '未知错误'}`))
        }
      }
    })

    ws.on('error', (error) => {
      if (!isResolved) {
        isResolved = true
        reject(new Error(`WebSocket错误: ${error.message}`))
      }
    })

    ws.on('close', (code, reason) => {
      if (!isResolved) {
        isResolved = true
        if (code !== 1000) {
          reject(new Error(`连接异常关闭: ${code} ${reason?.toString() || '未知原因'}`))
        }
        else {
          resolve(response || '连接正常关闭但无响应')
        }
      }
    })
  })
}
