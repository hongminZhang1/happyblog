'use client'

import { getReadingNoteList, getReadingNotesBySelectedTagName, getQueryReadingNotes } from '@/actions/readingnote'
import { getReadingNoteTags } from '@/actions/tags'
import Loading from '@/components/shared/loading'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import ReadingNoteListTable from './internal/readingnote-list-table'
import ReadingNoteSearch from './internal/readingnote-search'
import { ReadingNoteTagsContainer } from './internal/readingnote-tags-container'

export default function AdminReadingNotePage() {
  const [query, setQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const { data: readingNoteList, isPending: readingNoteListPending } = useQuery({
    queryKey: ['readingnote-list', query, selectedTags],
    queryFn: () => {
      if (query.trim())
        return getQueryReadingNotes(query)
      if (selectedTags.length > 0)
        return getReadingNotesBySelectedTagName(selectedTags)
      return getReadingNoteList()
    },
    staleTime: 1000 * 30,
  })

  const { data: readingNoteTags, isPending: readingNoteTagsPending } = useQuery({
    queryKey: ['readingnote-tags'],
    queryFn: getReadingNoteTags,
  })

  return (
    <main className="w-full flex flex-col gap-2">
      <ReadingNoteSearch setQuery={setQuery} />

      {
        !readingNoteTagsPending && <ReadingNoteTagsContainer readingNoteTagList={readingNoteTags ?? []} setSelectedTags={setSelectedTags} />
      }

      {
        (readingNoteListPending || readingNoteTagsPending)
          ? <Loading />
          : <ReadingNoteListTable readingNoteList={readingNoteList ?? []} />
      }
    </main>
  )
}