'use client'

import { getNoteList, getNotesBySelectedTagName } from '@/actions/notes'
import { Toggle } from '@/components/ui/toggle'
import { useNoteStore } from '@/store/use-note-store'
import { useSelectedTagStore } from '@/store/use-selected-tag-store'
import { useEffect } from 'react'
import { toast } from 'sonner'

// ! 后序需要重写样式, 现在稍微有些看不出来
export function NoteTagItemToggle({
  tag,
}: {
  tag: string
  onPressedChange?: (pressed: boolean) => void
}) {
  const { selectedTags, setSelectedTags } = useSelectedTagStore()
  const { setNotes } = useNoteStore()

  // * 切换页面时, 把保存的状态清空, 防止污染搜索
  useEffect(() => () => setSelectedTags([]), [setSelectedTags])

  const handleSelectedTagChange = async (selected: boolean) => {
    const updatedTags = selected
      ? [...selectedTags, tag]
      : selectedTags.filter(selectedTag => selectedTag !== tag)

    setSelectedTags(updatedTags)

    try {
      const blogs
        = updatedTags.length === 0
          ? await getNoteList()
          : await getNotesBySelectedTagName(updatedTags)
      setNotes(blogs)
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
