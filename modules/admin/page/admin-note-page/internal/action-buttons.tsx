import { deleteNoteById } from '@/actions/notes'
import { getAllTags } from '@/actions/tags'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useModalStore } from '@/store/use-modal-store'
import { useNoteStore } from '@/store/use-note-store'
import { useTagStore } from '@/store/use-tag-store'
import { Edit2, Eye, Trash } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function ActionButtons({
  noteId,
  slug,
  title,
}: {
  noteId: number
  slug: string
  title: string
}) {
  const { setModalOpen } = useModalStore()
  const { removeNote } = useNoteStore()
  const { setTags } = useTagStore()

  const handleDelete = async () => {
    try {
      const [, allTags] = await Promise.all([deleteNoteById(noteId), getAllTags()])
      removeNote(noteId)
      setTags(allTags)
      toast.success(`删除成功`)
    }
    catch (error) {
      if (error instanceof Error) {
        toast.error(`删除 「${title}」 出错~ ${error?.message}`)
      }
      else {
        toast.error(`删除 「${title}」 出错~`)
      }
    }
  }

  return (
    <section className="flex items-center gap-1">
      <Link
        href={`/note/${slug}`}
        className={cn(
          buttonVariants({ variant: 'outline', className: 'size-8' }),
        )}
      >
        <Eye className="size-4" />
      </Link>

      <Link
        href={`note/edit/${slug}`}
        className={cn(
          buttonVariants({ variant: 'outline', className: 'size-8' }),
        )}
      >
        <Edit2 className="size-4" />
      </Link>

      <Button
        variant="outline"
        className="size-8 text-red-600 cursor-pointer"
        onClick={() => {
          setModalOpen('deleteArticleModal', handleDelete)
        }}
      >
        <Trash />
      </Button>
    </section>
  )
}
