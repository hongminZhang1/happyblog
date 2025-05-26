import { getNoteTags } from '@/actions/tags'
import { NextResponse } from 'next/server'

export type NoteTagItem = Awaited<ReturnType<typeof getNoteTags>>[number]

export async function GET(): Promise<NextResponse<NoteTagItem[]>> {
  try {
    const noteTags = await getNoteTags()

    return NextResponse.json(noteTags)
  }
  catch {
    return new NextResponse('服务器内部错误~', { status: 500 })
  }
}
