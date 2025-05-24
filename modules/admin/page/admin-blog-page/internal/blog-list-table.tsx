'use client'

import type { WithTagsBlog } from '@/store/use-blog-store'
import { useBlogStore } from '@/store/use-blog-store'
import { motion } from 'motion/react'
import { useEffect } from 'react'
import { columns } from './blog-table-column'
import { DataTable } from './data-table'

export default function BlogListTable({ initialData }: { initialData: WithTagsBlog[] }) {
  const { blogs, setBlogs, isFirstRender, markRendered } = useBlogStore()

  useEffect(() => {
    if (isFirstRender) {
      setBlogs(initialData)
      markRendered()
    }
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
      <DataTable columns={columns} data={blogs} />
    </motion.main>
  )
}
