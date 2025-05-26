'use client'

import { getQueryBlog } from '@/actions/blogs'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useQueryLoader } from '@/hooks/use-query-loader'
import { fetchBlogListPromise } from '@/lib/api/blog'
import { cn } from '@/lib/utils'
import { useBlogStore } from '@/store/use-blog-store'
import { Plus, RotateCw, Search } from 'lucide-react'
import Link from 'next/link'

export function BlogSearch() {
  const { setBlogs } = useBlogStore()
  const { query, fetchData, setQuery, resetData } = useQueryLoader(
    fetchBlogListPromise,
    getQueryBlog,
    setBlogs,
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
          setQuery(value)
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
        href="blog/edit"
      >
        <Plus />
        创建博客
      </Link>
    </section>
  )
}
