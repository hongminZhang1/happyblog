'use client'

import type { UpdateTagNameDTO } from '@/actions/tags/type'
import {
  getAllTags,
  updateBlogTagById,
  updateNoteTagById,
} from '@/actions/tags'
import { UpdateTagNameSchema } from '@/actions/tags/type'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useModalStore } from '@/store/use-modal-store'
import { useTagStore } from '@/store/use-tag-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { TagType } from '@prisma/client'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export default function EditTagModal() {
  const { modalType, onModalClose, payload } = useModalStore()
  const isModalOpen = modalType === 'editTagModal'
  const { setTags } = useTagStore()
  const { id, tagName, tagType } = payload
    ? (payload as UpdateTagNameDTO)
    : {}

  const form = useForm<UpdateTagNameDTO>({
    resolver: zodResolver(UpdateTagNameSchema),
    defaultValues: {
      id: id ?? -1,
      tagName: tagName ?? '',
      tagType: tagType ?? TagType.BLOG,
    },
    mode: 'onBlur',
  })

  useEffect(() => {
    if (isModalOpen && tagName) {
      form.reset({
        id: id ?? -1,
        tagName: tagName ?? '',
        tagType: tagType ?? TagType.BLOG,
      })
    }
  }, [isModalOpen, form, tagName, id, tagType])

  const handleTagNameChange = async (values: UpdateTagNameDTO) => {
    try {
      switch (tagType) {
        case TagType.BLOG:
          await updateBlogTagById(values)
          break
        case TagType.NOTE:
          await updateNoteTagById(values)
          break
        default:
          throw new Error('标签类型错误!')
      }
      const allTags = await getAllTags()
      setTags(allTags)

      toast.success(`修改成功`)
    }
    catch (error) {
      if (error instanceof Error) {
        toast.error(`修改标签出错 ${error.message}`)
      }
      else {
        toast.error(`修改标签出错`)
      }
    }
  }

  async function onSubmit(values: UpdateTagNameDTO) {
    if (!id || id === -1 || !tagName) {
      toast.error(`id 和标签名为空`)
      return
    }
    await handleTagNameChange({ ...values })
    onModalClose()
  }
  return (
    <Dialog open={isModalOpen} onOpenChange={onModalClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>编辑标签</DialogTitle>
          <DialogDescription>
            修改标签名会影响所有关联的文章喵~
          </DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="tagName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>标签名</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入新的标签名" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="cursor-pointer">保存修改</Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
