'use client'

import type { ReadingNoteListItem } from '@/actions/readingnote/type'
import { motion } from 'motion/react'
import { DataTable } from './data-table'
import { columns } from './readingnote-table-column'

export default function ReadingNoteListTable({ readingNoteList }: { readingNoteList: ReadingNoteListItem[] }) {
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
      <DataTable columns={columns} data={readingNoteList} />
    </motion.main>
  )
}