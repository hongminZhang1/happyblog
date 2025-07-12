import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: 'Environment Variables Check',
    hasAppId: !!process.env.SPARK_APP_ID,
    hasApiKey: !!process.env.SPARK_API_KEY,
    hasApiSecret: !!process.env.SPARK_API_SECRET,
    appIdLength: process.env.SPARK_APP_ID?.length || 0,
    apiKeyLength: process.env.SPARK_API_KEY?.length || 0,
    apiSecretLength: process.env.SPARK_API_SECRET?.length || 0,
    nodeEnv: process.env.NODE_ENV,
    platform: process.platform,
    timestamp: new Date().toISOString(),
  })
}
