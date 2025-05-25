import { deleteBlogById } from '@/actions/blogs'
import { getAllTags } from '@/actions/tags'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useBlogStore } from '@/store/use-blog-store'
import { useModalStore } from '@/store/use-modal-store'
import { useTagStore } from '@/store/use-tag-store'
import { Edit2, Eye, Trash } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function ActionButtons({
  blogId,
  slug,
  title,
}: {
  blogId: number
  slug: string
  title: string
}) {
  const { setModalOpen } = useModalStore()
  const { removeBlog } = useBlogStore()
  const { setTags } = useTagStore()

  const handleDelete = async () => {
    try {
      const [, allTags] = await Promise.all([deleteBlogById(blogId), getAllTags()])
      removeBlog(blogId)
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
        href={`/blog/${slug}`}
        className={cn(
          buttonVariants({ variant: 'outline', className: 'size-8' }),
        )}
      >
        <Eye className="size-4" />
      </Link>

      <Link
        href={`blog/edit/${slug}`}
        className={cn(
          buttonVariants({ variant: 'outline', className: 'size-8' }),
        )}
      >
        <Edit2 className="size-4" />
      </Link>

      <Button
        variant="outline"
        className="size-8 text-red-600"
        onClick={() => setModalOpen('deleteArticleModal', handleDelete)}
      >
        <Trash className="size-4" />
      </Button>
    </section>
  )
}
