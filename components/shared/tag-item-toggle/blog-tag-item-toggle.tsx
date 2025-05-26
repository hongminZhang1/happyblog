'use client'

import { getBlogsBySelectedTagName } from '@/actions/blogs'
import { Toggle } from '@/components/ui/toggle'
import { fetchBlogListPromise } from '@/lib/api/blog'
import { useBlogStore } from '@/store/use-blog-store'
import { useSelectedTagStore } from '@/store/use-selected-tag-store'
import { useEffect } from 'react'
import { toast } from 'sonner'

export function BlogTagItemToggle({
  tag,
}: {
  tag: string
  onPressedChange?: (pressed: boolean) => void
}) {
  const { selectedTags, setSelectedTags } = useSelectedTagStore()
  const { setBlogs } = useBlogStore()

  // * 切换页面时, 把保存的状态清空, 防止污染搜索
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => setSelectedTags([]), [])

  const handleSelectedTagChange = async (selected: boolean) => {
    const updatedTags = selected
      ? [...selectedTags, tag]
      : selectedTags.filter(selectedTag => selectedTag !== tag)

    setSelectedTags(updatedTags)

    try {
      const blogs
        = updatedTags.length === 0
          ? await fetchBlogListPromise()
          : await getBlogsBySelectedTagName(updatedTags)
      setBlogs(blogs)
    }
    catch (error) {
      toast.error(`获取标签 ${updatedTags} 对应的文章失败~ ${error}`)
      console.error(`获取标签 ${updatedTags} 对应的文章失败~`, error)
    }
  }

  return (
    <Toggle
      variant="outline"
      size="sm"
      className="cursor-pointer"
      onPressedChange={handleSelectedTagChange}
    >
      {tag}
    </Toggle>
  )
}
