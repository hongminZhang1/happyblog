'use client'

import type { Tag } from '@/store/use-tag-store'
import { useTagStore } from '@/store/use-tag-store'
import { motion } from 'motion/react'
import { use, useEffect } from 'react'
import { DataTable } from './data-table'
import { columns } from './tag-table-column'

export default function TagListTable({ allTagsPromise }: { allTagsPromise: Promise<Tag[]> }) {
  const allTags = use(allTagsPromise)
  const setTags = useTagStore(state => state.setTags)

  useEffect(() => {
    setTags(allTags)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <motion.main
      className="flex-1"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 120,
        damping: 20,
      }}
    >
      <DataTable columns={columns} data={allTags} />
    </motion.main>
  )
}
