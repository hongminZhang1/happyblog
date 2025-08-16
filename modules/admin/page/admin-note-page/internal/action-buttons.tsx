import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useModalStore } from '@/store/use-modal-store'
import { TagType } from '@prisma/client'
import { Edit2, Eye, Trash } from 'lucide-react'
import Link from 'next/link'

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

  return (
    <section className="flex items-center gap-1">
      <Link
        href={`/w/note/${slug}`}
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
          setModalOpen('deleteArticleModal', {
            id: noteId,
            title,
            articleType: TagType.NOTE,
          })
        }}
      >
        <Trash />
      </Button>
    </section>
  )
}
