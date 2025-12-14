import type { getReadingNoteList } from '@/actions/readingnote'

export type ReadingNoteListItem = Awaited<ReturnType<typeof getReadingNoteList>>[number]