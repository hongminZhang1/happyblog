'use client'

import { getReadingNoteBySlug } from '@/actions/readingnote'
import { getReadingNoteTags } from '@/actions/tags'
import AdminArticleEditPage from '@/components/shared/admin-article-edit-page'
import Loading from '@/components/shared/loading'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

interface Props {
  params: { slug: string[] }
}

export default function AdminReadingNoteEditPage({ params }: Props) {
  const slug = params.slug?.[0]
  const isNewReadingNote = slug === 'new'

  const { data: readingNote, isPending: readingNotePending, error: readingNoteError } = useQuery({
    queryKey: ['readingnote-edit', slug],
    queryFn: () => getReadingNoteBySlug(slug),
    enabled: !isNewReadingNote,
  })

  // 添加超时处理
  const { data: allTags, isPending: tagsPending, error: tagsError } = useQuery({
    queryKey: ['readingnote-tags'],
    queryFn: async () => {
      try {
        const result = await getReadingNoteTags()
        console.log('标签获取成功:', result)
        return result
      } catch (error) {
        console.error('标签获取失败:', error)
        // 如果失败，返回空数组作为备用
        return []
      }
    },
    retry: 1,
    retryDelay: 1000,
    staleTime: 1000 * 60 * 5, // 5分钟缓存
    refetchOnWindowFocus: false,
  })

  const relatedTagNames = readingNote?.tags?.map(tag => tag.tagName)

  // 如果有错误，显示错误信息
  if (tagsError) {
    console.error('标签加载错误:', tagsError)
  }

  // 添加超时保护 - 如果加载超过10秒，直接渲染
  const [forceRender, setForceRender] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('强制渲染，标签可能加载失败')
      setForceRender(true)
    }, 10000) // 10秒超时
    
    return () => clearTimeout(timer)
  }, [])

  if ((readingNotePending && !isNewReadingNote) || (tagsPending && !forceRender)) {
    return <Loading />
  }

  return (
    <AdminArticleEditPage
      article={readingNote || null}
      relatedArticleTagNames={relatedTagNames}
      allTags={allTags ?? []}
    />
  )
}