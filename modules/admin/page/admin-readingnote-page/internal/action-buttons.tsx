import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useModalStore } from '@/store/use-modal-store'
import { Edit2, Eye, Trash } from 'lucide-react'
import Link from 'next/link'

export default function ActionButtons({
  readingNoteId,
  slug,
  title,
}: {
  readingNoteId: number
  slug: string
  title: string
}) {
  const { setModalOpen } = useModalStore()

  return (
    <section className="flex items-center gap-1">
      <Link
        href={`/w/readingnote/${slug}`}
        className={cn(
          buttonVariants({ variant: 'outline', className: 'size-8' }),
        )}
      >
        <Eye className="size-4" />
      </Link>

      <Link
        href={`readingnote/edit/${slug}`}
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
            id: readingNoteId,
            title,
            articleType: 'READING_NOTE',
          })
        }}
      >
        <Trash />
      </Button>
    </section>
  )
}