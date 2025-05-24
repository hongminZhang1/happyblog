import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useModalStore } from '@/store/use-modal-store'

export default function DeleteTagModal() {
  const { modalType, payload, onModalClose } = useModalStore()
  const isModalOpen = modalType === 'deleteTagModal'

  return (
    <Dialog open={isModalOpen} onOpenChange={onModalClose}>
      <DialogContent className="flex flex-col items-center gap-4">
        <DialogHeader className="flex flex-col items-center">
          <DialogTitle>确定要删除该标签吗🥹</DialogTitle>
          <DialogDescription>
            不会删除关联的所有文章哦, 只是断开标签和文章的连接
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-4">
          <Button
            variant="destructive"
            className="cursor-pointer"
            type="submit"
            onClick={() => {
              typeof payload === 'function' && payload()
            }}
          >
            确定
          </Button>
          <Button variant="outline" onClick={onModalClose}>
            取消
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
