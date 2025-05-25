import type { BlogTagItem } from '@/app/api/(cache)/blog/getBlogTags/route'
import type { BlogListItem } from '@/store/use-blog-store'

export async function fetchBlogListPromise(): Promise<BlogListItem[]> {
  return ((await fetch(`${process.env!.SITE_URL}/api/blog/getBlogList`, {
    cache: 'force-cache',
  })).json())
}

export async function fetchBlogTagsPromise(): Promise<BlogTagItem[]> {
  return ((await fetch(`${process.env!.SITE_URL}/api/blog/getBlogTags`, {
    cache: 'force-cache',
  })).json())
}
