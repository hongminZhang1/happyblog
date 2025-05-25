import { deleteEchoById } from '@/actions/echos'
import { Button } from '@/components/ui/button'
import { useEchoStore } from '@/store/use-echo-store'
import { useModalStore } from '@/store/use-modal-store'
import { Edit2, Trash } from 'lucide-react'
import { toast } from 'sonner'

export default function ActionButtons({
  id,
  content,
  isPublished,
  reference,
}: {
  id: number
  content: string
  isPublished: boolean
  reference: string
}) {
  const { setModalOpen } = useModalStore()

  const handleEchoDelete = async () => {
    try {
      await deleteEchoById(id)

      toast.success(`删除成功~`)
    }
    catch (error) {
      if (error instanceof Error) {
        toast.error(`删除 echo 失败 ${error.message}`)
      }
      else {
        toast.error(`删除 echo 失败`)
      }
    }
  }

  return (
    <section className="flex items-center gap-1">
      <Button
        variant="outline"
        className="size-8 cursor-pointer"
        onClick={() => {
          setModalOpen('editEchoModal', {
            id,
            content,
            isPublished,
            reference,
          })
        }}
      >
        <Edit2 className="size-4" />
      </Button>
      <Button
        variant="outline"
        className="size-8 text-red-600 cursor-pointer"
        onClick={() => {
          setModalOpen('deleteEchoModal', handleEchoDelete)
        }}
      >
        <Trash />
      </Button>
    </section>
  )
}
