import { getAllBlogs, getTagsOnBlog } from '@/actions/blogs'
import BlogListTable from './internal/blog-list-table'
import { BlogSearch } from './internal/blog-search'
import { BlogTagsContainer } from './internal/blog-tags-container'

export default async function AdminBlogPage() {
  const [allBlogTags, allBlogs] = await Promise.all([getTagsOnBlog(), getAllBlogs()])
  const tags = allBlogTags.map(v => v.tagName)

  return (
    <main className="w-full flex flex-col gap-2">
      <BlogSearch />
      <BlogTagsContainer tags={tags} />
      <BlogListTable initialData={allBlogs} />
    </main>
  )
}
