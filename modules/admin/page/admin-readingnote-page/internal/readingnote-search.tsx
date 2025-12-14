'use client'

import type { Dispatch, SetStateAction } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Plus, RotateCw, Search } from 'lucide-react'
import Link from 'next/link'
import { memo, useRef } from 'react'

function ReadingNoteSearch({ setQuery }: { setQuery: Dispatch<SetStateAction<string>> }) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <section className="flex gap-2">
      <Input
        placeholder="请输入标题喵~"
        className="w-1/2 xl:w-1/3"
        ref={inputRef}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            const query = inputRef.current?.value
            if (query?.trim()) {
              setQuery(query)
            }
            else {
              setQuery('')
            }
          }
        }}
      />

      <Button
        size="sm"
        onClick={() => {
          const query = inputRef.current?.value
          if (query?.trim()) {
            setQuery(query)
          }
          else {
            setQuery('')
          }
        }}
      >
        <Search className="w-4 h-4 mr-1" />
        搜索
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          setQuery('')
          if (inputRef.current) {
            inputRef.current.value = ''
          }
        }}
      >
        <RotateCw className="w-4 h-4 mr-1" />
        重置
      </Button>

      <div className="flex-1" />

      <Link
        href="/admin/readingnote/edit/new"
        className={cn(buttonVariants({ size: 'sm' }))}
      >
        <Plus className="w-4 h-4 mr-1" />
        新建阅读笔记
      </Link>
    </section>
  )
}

export default memo(ReadingNoteSearch)