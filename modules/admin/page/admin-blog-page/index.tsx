'use client'

import { getBlogList, getQueryBlog } from '@/actions/blogs'
import { getBlogTags } from '@/actions/tags'
import Loading from '@/components/shared/loading'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import BlogListTable from './internal/blog-list-table'
import { BlogSearch } from './internal/blog-search'
import { BlogTagsContainer } from './internal/blog-tags-container'

// todo: tag-container 应该整一个单独的动画
export default function AdminBlogPage() {
  const [query, setQuery] = useState('')

  const { data: blogList, isPending: blogListPending } = useQuery({
    queryKey: ['blog-list', query],
    queryFn: () => query.trim() ? getQueryBlog(query) : getBlogList(),
    staleTime: 1000 * 30,
  })

  const { data: blogTags, isPending: blogTagsPending } = useQuery({
    queryKey: ['blog-tags'],
    queryFn: getBlogTags,
  })

  return (
    <main className="w-full flex flex-col gap-2">
      <BlogSearch setQuery={setQuery} />
      {
        (blogListPending || blogTagsPending)
          ? <Loading />
          : (
              <>
                <BlogTagsContainer blogTags={blogTags ?? []} />
                <BlogListTable blogList={blogList ?? []} />
              </>
            )
      }
    </main>
  )
}
