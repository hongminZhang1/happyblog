'use client'

import type { UpdateEchoDTO } from '@/actions/echos/type'
import { getAllEchos, updateEchoById } from '@/actions/echos'
import { UpdateEchoSchema } from '@/actions/echos/type'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
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
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useEchoStore } from '@/store/use-echo-store'
import { useModalStore } from '@/store/use-modal-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export default function EditEchoModal() {
  const { modalType, onModalClose, payload } = useModalStore()
  const isModalOpen = modalType === 'editEchoModal'
  const { setEchos } = useEchoStore()

  const { id, content, isPublished, reference } = payload
    ? (payload as UpdateEchoDTO)
    : {}

  const initialValues: UpdateEchoDTO = {
    content: content ?? '',
    reference: reference ?? '',
    isPublished: isPublished ?? true,
    id: id ?? -1,
  }

  const form = useForm<UpdateEchoDTO>({
    resolver: zodResolver(UpdateEchoSchema),
    defaultValues: {
      content: '',
      reference: '',
      isPublished: true,
      id: id ?? -1,
    },
    mode: 'onBlur',
  })

  useEffect(() => {
    if (isModalOpen) {
      form.reset(initialValues)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen, form])

  const handleEditEcho = async (values: UpdateEchoDTO) => {
    if (!id || id === -1) {
      toast.error(`引用 id 不存在`)
      return
    }

    try {
      await updateEchoById({ ...values, id })
      const echos = await getAllEchos()
      setEchos(echos)
      toast.success(`更新成功`)
    }
    catch (error) {
      if (error instanceof Error) {
        toast.error(`更新引用失败~ ${error.message}`)
      }
      else {
        toast.error('更新引用失败~')
      }
    }
  }

  async function onSubmit(values: UpdateEchoDTO) {
    handleEditEcho(values)
    onModalClose()
  }

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={() => {
        form.reset(initialValues)
        onModalClose()
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>编辑引用</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>引用</FormLabel>
                    <FormControl>
                      <Textarea
                        className="resize-none h-52"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>来源</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入来源" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isPublished"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">是否发布</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked)
                        }}
                      />
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
