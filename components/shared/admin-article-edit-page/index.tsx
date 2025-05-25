'use client'

import type { Blog, Note } from '@prisma/client'
import type { ArticleDTO } from './type'
import { createBlog, updateBlogById } from '@/actions/blogs'
import { createNote, updateNoteById } from '@/actions/notes'
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
import { useBlogStore } from '@/store/use-blog-store'
import { useBlogTagStore } from '@/store/use-blog-tag-store'
import { useModalStore } from '@/store/use-modal-store'
import { useNoteStore } from '@/store/use-note-store'
import { useNoteTagStore } from '@/store/use-note-tag-store'
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
}: {
  article: Blog | Note | null
  relatedArticleTagNames?: string[]
}) {
  const router = useRouter()
  const { setModalOpen } = useModalStore()
  const pathname = usePathname()
  const editPageType = parseEditPageTypeFromUrl(pathname)

  const { blogTags } = useBlogTagStore()
  const { noteTags } = useNoteTagStore()
  const { appendBlog, updateBlog } = useBlogStore()
  const { appendNote, updateNote } = useNoteStore()

  const allTags = editPageType === 'BLOG' ? blogTags : noteTags

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
          case TagType.BLOG: {
            const { createdAt, id, isPublished, slug, tags, title, updatedAt } = await updateBlogById({ ...values, id: article.id })
            updateBlog({ createdAt, id, isPublished, slug, tags, title, updatedAt })
            break
          }
          case TagType.NOTE: {
            const { tags, createdAt, id, isPublished, slug, title, updatedAt } = await updateNoteById({ ...values, id: article.id })
            updateNote({ createdAt, id, isPublished, slug, tags, title, updatedAt })
            break
          }
          default:
            throw new Error(`文章类型错误`)
        }
      }
      else {
        switch (editPageType) {
          case TagType.BLOG: {
            const { id, createdAt, isPublished, slug, title, updatedAt, tags } = await createBlog(values)
            appendBlog({ id, createdAt, isPublished, slug, title, updatedAt, tags })
            break
          }
          case TagType.NOTE: {
            const { id, createdAt, isPublished, slug, title, updatedAt, tags } = await createNote(values)
            appendNote({ createdAt, id, isPublished, slug, tags, title, updatedAt })
            break
          }
          default:
            throw new Error(`文章类型错误`)
        }
      }

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
                        label: el,
                        value: el,
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
