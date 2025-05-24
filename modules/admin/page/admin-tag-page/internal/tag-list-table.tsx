'use client'

import type { Tag } from '@/store/use-tag-store'
import { useTagStore } from '@/store/use-tag-store'
import { motion } from 'motion/react'
import { useEffect } from 'react'
import { DataTable } from './data-table'
import { columns } from './tag-table-column'

export default function TagListTable({ initialData }: { initialData: Tag[] }) {
  const { tags, setTags, isFirstRender, markRendered } = useTagStore()

  useEffect(() => {
    if (isFirstRender) {
      setTags(initialData)
      markRendered()
    }
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
      <DataTable columns={columns} data={tags} />
    </motion.main>
  )
}
