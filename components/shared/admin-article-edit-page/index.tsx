'use client'

import type { Blog, BlogTag, Note, NoteTag } from '@prisma/client'
import type { ArticleDTO } from './type'
import { createBlog, updateBlogById } from '@/actions/blogs'
import { createNote, updateNoteById } from '@/actions/notes'
import { getAllTags } from '@/actions/tags'
import { Button } from '@/components/ui/button'
import { Combobox } from '@/components/ui/combobox'
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
import { useModalStore } from '@/store/use-modal-store'
import { useTagStore } from '@/store/use-tag-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { TagType } from '@prisma/client'
import { File } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import MarkdownEditor from './internal/markdown-editor'
import { ArticleSchema } from './type'

function parseEditPageTypeFromUrl(url: string): TagType {
  const type = url.split('/')[2].toUpperCase()
  if (type === TagType.BLOG || type === TagType.NOTE) {
    return type
  }
  throw new Error(`解析编辑页面类型错误`)
}

export default function AdminArticleEditPage({
  article,
  relatedArticleTagNames,
  allTags,
}: {
  article: Blog | Note | null
  relatedArticleTagNames?: string[]
  allTags: BlogTag[] | NoteTag[]
}) {
  const router = useRouter()
  const { setModalOpen } = useModalStore()
  const pathname = usePathname()
  const editPageType = parseEditPageTypeFromUrl(pathname)

  const { setTags } = useTagStore()

  const form = useForm<ArticleDTO>({
    resolver: zodResolver(ArticleSchema),
    defaultValues: {
      title: article?.title ?? '',
      slug: article?.slug ?? '',
      isPublished: article?.isPublished ?? false,
      relatedTagNames: relatedArticleTagNames ?? [],
      content: article?.content ?? '',
    },
    mode: 'onBlur',
  })

  async function onSubmit(values: ArticleDTO) {
    try {
      if (article?.id) {
        switch (editPageType) {
          case TagType.BLOG:
            await updateBlogById({ ...values, id: article.id })
            break
          case TagType.NOTE:
            await updateNoteById({ ...values, id: article.id })
            break
          default:
            throw new Error(`文章类型错误`)
        }
      }
      else {
        switch (editPageType) {
          case TagType.BLOG:
            await createBlog(values)
            break
          case TagType.NOTE:
            await createNote(values)
            break
          default:
            throw new Error(`文章类型错误`)
        }
      }
      const allTags = await getAllTags()
      setTags(allTags)

      toast.success('保存成功')
      router.push(`/admin/${editPageType.toLowerCase()}/edit/${values.slug}`)
    }
    catch (error) {
      if (error instanceof Error) {
        toast.error(`保存失败 ${error.message}`)
      }
      else {
        toast.error(`保存失败`)
      }
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-full pb-44"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">标题</FormLabel>
              <FormControl>
                <Input placeholder="请输入标题" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">slug</FormLabel>
              <FormControl>
                <Input placeholder="请输入 slug" {...field} />
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
                >
                </Switch>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-end gap-2">
          <FormField
            control={form.control}
            name="relatedTagNames"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel className="text-lg">标签</FormLabel>
                <FormControl>
                  <Combobox
                    options={
                      allTags.map(el => ({
                        label: el.tagName,
                        value: el.tagName,
                      })) ?? []
                    }
                    multiple
                    clearable
                    selectPlaceholder="请选择标签"
                    value={field.value}
                    onValueChange={val =>
                      form.setValue('relatedTagNames', val, {
                        shouldValidate: true,
                      })}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="button"
            variant="default"
            onClick={() => setModalOpen('createTagModal')}
            className="cursor-pointer"
          >
            新建标签
          </Button>
        </div>

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">内容</FormLabel>
              <FormControl>
                <MarkdownEditor value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          <File />
          保存
        </Button>
      </form>
    </Form>
  )
}
