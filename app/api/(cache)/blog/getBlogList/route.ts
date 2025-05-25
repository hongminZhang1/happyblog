import type { BlogListItem } from '@/store/use-blog-store'
import { getBlogList } from '@/actions/blogs'
import { NextResponse } from 'next/server'

export async function GET(): Promise<NextResponse<BlogListItem[]>> {
  try {
    const blogs = await getBlogList()

    return NextResponse.json(blogs)
  }
  catch {
    return new NextResponse('服务器内部错误~', { status: 500 })
  }
}
