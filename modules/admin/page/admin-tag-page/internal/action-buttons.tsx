import { deleteBlogTagById, deleteNoteTagById, getAllTags } from '@/actions/tags'
import { Button } from '@/components/ui/button'
import { useBlogTagStore } from '@/store/use-blog-tag-store'
import { useModalStore } from '@/store/use-modal-store'
import { useNoteTagStore } from '@/store/use-note-tag-store'
import { useTagStore } from '@/store/use-tag-store'
import { TagType } from '@prisma/client'
import { Edit2, Trash } from 'lucide-react'
import { toast } from 'sonner'

export default function ActionButtons({
  id,
  tagName,
  tagType,
}: {
  id: number
  tagName: string
  tagType: TagType
}) {
  const { setModalOpen, onModalClose } = useModalStore()
  const { removeBlogTag } = useBlogTagStore()
  const { removeNoteTag } = useNoteTagStore()
  const { setTags } = useTagStore()

  const handleDelete = async () => {
    try {
      switch (tagType) {
        case TagType.BLOG: {
          const tag = await deleteBlogTagById(id)
          removeBlogTag(tag.tagName)
          break
        }
        case TagType.NOTE: {
          const tag = await deleteNoteTagById(id)
          removeNoteTag(tag.tagName)
          break
        }
        default:
          throw new Error('标签类型错误或 id 不存在!')
      }
      const allTags = await getAllTags()
      setTags(allTags)

      toast.success(`删除标签 #${tagName} 成功`)
    }
    catch (error) {
      if (error instanceof Error) {
        toast.error(`删除标签 ${tagName} 失败~ ${error.message}`)
      }
      else {
        toast.error(`删除标签 ${tagName} 出错~`)
      }
    }
    onModalClose()
  }

  return (
    <section className="flex items-center gap-1">
      <Button
        variant="outline"
        className="size-8 cursor-pointer"
        onClick={() =>
          setModalOpen('editTagModal', {
            id,
            tagName,
            tagType,
          })}
      >
        <Edit2 className="size-4" />
      </Button>

      <Button
        variant="outline"
        className="size-8 text-red-600"
        onClick={() => {
          setModalOpen('deleteTagModal', handleDelete)
        }}
      >
        <Trash />
      </Button>
    </section>
  )
}
