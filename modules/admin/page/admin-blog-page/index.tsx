'use client'

import { getBlogList } from '@/actions/blogs'
import { getBlogTags } from '@/actions/tags'
import Loading from '@/components/shared/loading'
import { useQuery } from '@tanstack/react-query'
import BlogListTable from './internal/blog-list-table'
import { BlogSearch } from './internal/blog-search'
import { BlogTagsContainer } from './internal/blog-tags-container'

export default function AdminBlogPage() {
  const { data: blogTags, isPending: blogTagsPending } = useQuery({
    queryKey: ['blog-tags'],
    queryFn: getBlogTags,
  })

  const { data: blogList, isPending: blogListPending } = useQuery({
    queryKey: ['blog-list'],
    queryFn: getBlogList,
  })

  return (
    <main className="w-full flex flex-col gap-2">
      <BlogSearch />
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
