'use client'

import type { NoteListItem } from '@/store/use-note-store'
import { useNoteStore } from '@/store/use-note-store'
import { motion } from 'motion/react'
import { use, useEffect } from 'react'
import { DataTable } from './data-table'
import { columns } from './note-table-column'

export default function NoteListTable({ noteListPromise }: { noteListPromise: Promise<NoteListItem[]> }) {
  const noteList = use(noteListPromise)
  const { notes, setNotes } = useNoteStore()

  useEffect(() => {
    // todo: isFirstRender?
    setNotes(noteList)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <motion.main
      className="h-full"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 120,
        damping: 20,
      }}
    >
      <DataTable columns={columns} data={notes} />
    </motion.main>
  )
}
