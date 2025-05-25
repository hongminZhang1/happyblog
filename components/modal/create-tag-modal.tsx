'use client'

import type { CreateTagDTO } from '@/actions/tags/type'
import {
  createBlogTag,
  createNoteTag,
  getAllTags,
} from '@/actions/tags'
import { CreateTagSchema } from '@/actions/tags/type'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useBlogTagStore } from '@/store/use-blog-tag-store'
import { useModalStore } from '@/store/use-modal-store'
import { useNoteTagStore } from '@/store/use-note-tag-store'
import { useTagStore } from '@/store/use-tag-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { TagType } from '@prisma/client'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export default function CreateTagModal() {
  const { modalType, onModalClose } = useModalStore()
  const isModalOpen = modalType === 'createTagModal'
  const { setTags } = useTagStore()
  const { appendBlogTag } = useBlogTagStore()
  const { appendNoteTag } = useNoteTagStore()

  const form = useForm<CreateTagDTO>({
    resolver: zodResolver(CreateTagSchema),
    defaultValues: {
      tagName: '',
      tagType: TagType.BLOG,
    },
    mode: 'onBlur',
  })

  const handleCreateTag = async (values: CreateTagDTO) => {
    try {
      switch (values.tagType) {
        case TagType.BLOG: {
          const tag = await createBlogTag(values.tagName)
          appendBlogTag(tag.tagName)
          break
        }
        case TagType.NOTE: {
          const tag = await createNoteTag(values.tagName)
          appendNoteTag(tag.tagName)
          break
        }
        default:
          throw new Error('tag type 不匹配')
      }

      const allTags = await getAllTags()
      setTags(allTags)
      toast.success(`创建成功`)
    }
    catch (error) {
      if (error instanceof Error) {
        toast.error(`创建标签失败~ ${error.message}`)
      }
      else {
        toast.error(`创建标签失败~`)
      }
    }
  }

  useEffect(() => {
    if (!isModalOpen) {
      form.reset()
    }
  }, [isModalOpen, form])

  function onSubmit(values: CreateTagDTO) {
    handleCreateTag(values)
    onModalClose()
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onModalClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>新建标签</DialogTitle>
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
                      <Input placeholder="请输入标签名" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tagType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>标签类型</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value)
                        }}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="请选择" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={TagType.BLOG}>BLOG</SelectItem>
                          <SelectItem value={TagType.NOTE}>NOTE</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" className="cursor-pointer">保存</Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
