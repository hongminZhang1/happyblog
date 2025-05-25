'use client'

import { getNoteList, getQueryNotes } from '@/actions/notes'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useQueryLoader } from '@/hooks/use-query-loader'
import { cn } from '@/lib/utils'
import { useNoteStore } from '@/store/use-note-store'
import { Plus, RotateCw, Search } from 'lucide-react'
import Link from 'next/link'

export function NoteSearch() {
  const { setNotes } = useNoteStore()
  const { query, setQuery, fetchData, resetData } = useQueryLoader(
    getNoteList,
    getQueryNotes,
    setNotes,
  )

  return (
    <section className="flex gap-2">
      <Input
        placeholder="请输入标题喵~"
        className="w-1/2 xl:w-1/3"
        value={query}
        onChange={(e) => {
          const value = e.target.value
          if (value === ' ')
            return
          setQuery(e.target.value)
        }}
        onKeyDown={e => e.key === 'Enter' && fetchData()}
      />

      <Button
        type="button"
        variant="secondary"
        onClick={fetchData}
        className="cursor-pointer"
      >
        <Search />
        搜索
      </Button>

      <Button
        variant="secondary"
        onClick={resetData}
        className="cursor-pointer"
      >
        <RotateCw />
        重置
      </Button>

      <Link
        className={cn(
          buttonVariants({ variant: 'secondary' }),
          'cursor-pointer',
        )}
        href="note/edit"
      >
        <Plus />
        创建笔记
      </Link>
    </section>
  )
}
