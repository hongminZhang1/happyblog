import type { Tag } from '@/store/use-tag-store'
import { getAllTags } from '@/actions/tags'
import { NextResponse } from 'next/server'

export async function GET(): Promise<NextResponse<Tag[]>> {
  try {
    const allTags = await getAllTags()

    return NextResponse.json(allTags)
  }
  catch {
    return new NextResponse('服务器内部错误~', { status: 500 })
  }
}
