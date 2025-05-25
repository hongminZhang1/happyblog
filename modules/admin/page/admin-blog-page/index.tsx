import { getBlogList, getTagsOnBlog } from '@/actions/blogs'
import Loading from '@/components/shared/loading'
import { Suspense } from 'react'
import BlogListTable from './internal/blog-list-table'
import { BlogSearch } from './internal/blog-search'
import { BlogTagsContainer } from './internal/blog-tags-container'

const allBlogsPromise = getBlogList()
const initialDataPromise = getTagsOnBlog()

export default function AdminBlogPage() {
  return (
    <main className="w-full flex flex-col gap-2">
      <BlogSearch />
      <Suspense fallback={<Loading />}>
        <BlogTagsContainer initialDataPromise={initialDataPromise} />
        <BlogListTable initialDataPromise={allBlogsPromise} />
      </Suspense>
    </main>
  )
}
