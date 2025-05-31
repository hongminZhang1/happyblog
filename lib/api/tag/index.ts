import type { Tag } from '@/store/use-tag-store'

export async function fetchAllTagsPromise(): Promise<Tag[]> {
  return ((await fetch(`${process.env!.SITE_URL}/api/tag/getAllTags`, {
    cache: 'force-cache',
  })).json())
}
