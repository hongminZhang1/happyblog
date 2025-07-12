import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    hasAppId: !!process.env.SPARK_APP_ID,
    hasApiKey: !!process.env.SPARK_API_KEY,
    hasApiSecret: !!process.env.SPARK_API_SECRET,
    appIdLength: process.env.SPARK_APP_ID?.length || 0,
    apiKeyLength: process.env.SPARK_API_KEY?.length || 0,
    apiSecretLength: process.env.SPARK_API_SECRET?.length || 0,
    appIdPreview: process.env.SPARK_APP_ID ? `${process.env.SPARK_APP_ID.slice(0, 4)}****` : '未配置',
    apiKeyPreview: process.env.SPARK_API_KEY ? `${process.env.SPARK_API_KEY.slice(0, 8)}****` : '未配置',
    nodeEnv: process.env.NODE_ENV
  })
} 