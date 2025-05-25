import Loading from '@/components/shared/loading'
import { Suspense } from 'react'
import BlogListTable from './internal/blog-list-table'
import { BlogSearch } from './internal/blog-search'
import { BlogTagsContainer } from './internal/blog-tags-container'
import { fetchBlogListPromise, fetchBlogTagsPromise } from '@/lib/api/blog'

export default function AdminBlogPage() {
  const blogListPromise = fetchBlogListPromise()
  const blogTagsPromise = fetchBlogTagsPromise()


  return (
    <main className="w-full flex flex-col gap-2">
      <BlogSearch />
      <Suspense fallback={<Loading />}>
        <BlogTagsContainer blogTagsPromise={blogTagsPromise} />
        <BlogListTable blogListPromise={blogListPromise} />
      </Suspense>
    </main>
  )
}
