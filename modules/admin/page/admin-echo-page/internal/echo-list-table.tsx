'use client'

import type { Echo } from '@prisma/client'
import { useEchoStore } from '@/store/use-echo-store'
import { motion } from 'motion/react'
import { useEffect } from 'react'
import { DataTable } from './data-table'
import { columns } from './echo-table-column'

export default function EchoListTable({ initialData }: { initialData: Echo[] }) {
  const { echos, setEchos, isFirstRender, markRendered } = useEchoStore()

  useEffect(() => {
    if (isFirstRender) {
      setEchos(initialData)
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
      <DataTable columns={columns} data={echos} />
    </motion.main>
  )
}
