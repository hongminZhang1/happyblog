import { getBlogTags } from '@/actions/tags'
import { NextResponse } from 'next/server'

export type BlogTagItem = Awaited<ReturnType<typeof getBlogTags>>[number]

export async function GET(): Promise<NextResponse<BlogTagItem[]>> {
  try {
    const blogTags = await getBlogTags()

    return NextResponse.json(blogTags)
  }
  catch {
    return new NextResponse('服务器内部错误~', { status: 500 })
  }
}
