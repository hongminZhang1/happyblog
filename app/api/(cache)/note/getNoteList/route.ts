import type { NoteListItem } from '@/store/use-note-store'
import { getNoteList } from '@/actions/notes'
import { NextResponse } from 'next/server'

export async function GET(): Promise<NextResponse<NoteListItem[]>> {
  try {
    const notes = await getNoteList()

    return NextResponse.json(notes)
  }
  catch {
    return new NextResponse('服务器内部错误~', { status: 500 })
  }
}
