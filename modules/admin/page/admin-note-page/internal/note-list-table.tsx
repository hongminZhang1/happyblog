'use client'

import type { NoteListItem } from '@/store/use-note-store'
import { motion } from 'motion/react'
import { use } from 'react'
import { DataTable } from './data-table'
import { columns } from './note-table-column'

export default function NoteListTable({ noteListPromise }: { noteListPromise: Promise<NoteListItem[]> }) {
  const noteList = use(noteListPromise)

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
      <DataTable columns={columns} data={noteList} />
    </motion.main>
  )
}
