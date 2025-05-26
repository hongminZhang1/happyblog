import type { Echo } from '@prisma/client'
import { getAllEchos } from '@/actions/echos'
import { NextResponse } from 'next/server'

export async function GET(): Promise<NextResponse<Echo[]>> {
  try {
    const allEchos = await getAllEchos()

    return NextResponse.json(allEchos)
  }
  catch {
    return new NextResponse('服务器内部错误~', { status: 500 })
  }
}
