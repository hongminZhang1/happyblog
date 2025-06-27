'use client'

import type { SearchResult, SearchType } from '@/actions/search'
import { searchContent } from '@/actions/search'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import MaxWidthWrapper from '@/components/shared/max-width-wrapper'
import { BookOpen, Calendar, FileText, Search, Tag } from 'lucide-react'
import * as motion from 'motion/react-client'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [searchType, setSearchType] = useState<SearchType>((searchParams.get('type') as SearchType) || 'all')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) {
        setResults([])
        setError(null)
        return
      }

      setLoading(true)
      setError(null)
      // console.log('开始搜索:', { query, searchType }) // 调试信息
      
      try {
        const searchResults = await searchContent(query, searchType)
        // console.log('搜索结果:', searchResults) // 调试信息
        setResults(searchResults)
      } catch (error) {
        console.error('搜索失败:', error)
        setError(error instanceof Error ? error.message : '搜索失败')
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    performSearch()
  }, [query, searchType])

  const updateURL = (newQuery: string, newType: SearchType) => {
    const params = new URLSearchParams()
    if (newQuery.trim()) {
      params.set('q', newQuery)
    }
    if (newType !== 'all') {
      params.set('type', newType)
    }
    
    const newURL = params.toString() ? `/search?${params.toString()}` : '/search'
    router.replace(newURL, { scroll: false })
  }

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery)
    updateURL(newQuery, searchType)
  }

  const handleTypeChange = (newType: SearchType) => {
    setSearchType(newType)
    updateURL(query, newType)
  }

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text

    const regex = new RegExp(`(${query})`, 'gi')
    const parts = text.split(regex)

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800/50 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    )
  }

  const getContentPreview = (content: string, query: string) => {
    if (!query.trim()) return `${content.slice(0, 200)}...`

    const index = content.toLowerCase().indexOf(query.toLowerCase())
    if (index === -1) return `${content.slice(0, 200)}...`

    const start = Math.max(0, index - 80)
    const end = Math.min(content.length, index + query.length + 120)
    const preview = content.slice(start, end)

    return `${start > 0 ? '...' : ''}${preview}${end < content.length ? '...' : ''}`
  }

  return (
    <MaxWidthWrapper className="py-8">
      <div className="space-y-6">
        {/* 搜索标题 */}
        <div className="text-center py-4">
          <h1 className="text-3xl font-bold mb-2">搜索</h1>
          <p className="text-muted-foreground">在博客和笔记中查找内容</p>
        </div>

        {/* 搜索框 */}
        <Card className="p-6">
          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <Input
                placeholder="输入关键词搜索..."
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                className="w-full"
                autoFocus
              />
            </div>
            <Select value={searchType} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="blog">博客</SelectItem>
                <SelectItem value="note">笔记</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {query && (
            <p className="text-sm text-muted-foreground">
              搜索关键词: "<span className="font-medium">{query}</span>"
              {searchType !== 'all' && ` 在 ${searchType === 'blog' ? '博客' : '笔记'} 中`}
            </p>
          )}
        </Card>

        {/* 调试信息 */}
        {/* {process.env.NODE_ENV === 'development' && (
          <Card className="p-4 bg-gray-50 dark:bg-gray-900">
            <h3 className="font-medium mb-2">调试信息:</h3>
            <pre className="text-xs text-muted-foreground">
              {JSON.stringify({ query, searchType, loading, resultsCount: results.length, error }, null, 2)}
            </pre>
          </Card>
        )} */}

        {/* 错误信息 */}
        {error && (
          <Card className="p-6 border-red-200 bg-red-50 dark:bg-red-950">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <Search className="w-5 h-5" />
              <span className="font-medium">搜索出错:</span>
              <span>{error}</span>
            </div>
          </Card>
        )}

        {/* 搜索结果 */}
        <div className="space-y-4">
          {loading && (
            <Card className="p-8">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mr-3"></div>
                <span className="text-muted-foreground">搜索中...</span>
              </div>
            </Card>
          )}

          {!loading && query && results.length === 0 && !error && (
            <Card className="p-8 text-center">
              <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">未找到相关内容</h3>
              <p className="text-muted-foreground">
                尝试使用不同的关键词或检查拼写
              </p>
            </Card>
          )}

          {!loading && !query && (
            <Card className="p-8 text-center">
              <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">开始搜索</h3>
              <p className="text-muted-foreground">
                在上方输入框中输入关键词来搜索博客和笔记
              </p>
            </Card>
          )}

          {!loading && results.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  搜索结果 ({results.length})
                </h2>
              </div>

              <motion.div
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {results.map((result, index) => (
                  <motion.div
                    key={`${result.type}-${result.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="p-6 hover:shadow-md transition-shadow">
                      <Link href={`/${result.type}/${result.slug}`} className="block">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 mt-1">
                            {result.type === 'blog' ? (
                              <FileText className="w-6 h-6 text-blue-500" />
                            ) : (
                              <BookOpen className="w-6 h-6 text-green-500" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge
                                variant={result.type === 'blog' ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {result.type === 'blog' ? '博客' : '笔记'}
                              </Badge>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Calendar className="w-3 h-3" />
                                {new Date(result.createdAt).toLocaleDateString()}
                              </div>
                            </div>

                            <h3 className="font-semibold text-lg mb-3 line-clamp-2 hover:text-purple-600 transition-colors">
                              {highlightText(result.title, query)}
                            </h3>

                            <p className="text-muted-foreground text-sm mb-4 line-clamp-3 leading-relaxed">
                              {highlightText(getContentPreview(result.content, query), query)}
                            </p>

                            {result.tags.length > 0 && (
                              <div className="flex items-center gap-2 flex-wrap">
                                <Tag className="w-3 h-3 text-muted-foreground" />
                                {result.tags.slice(0, 4).map((tag) => (
                                  <Badge key={tag.tagName} variant="outline" className="text-xs">
                                    {tag.tagName}
                                  </Badge>
                                ))}
                                {result.tags.length > 4 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{result.tags.length - 4}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}
        </div>
      </div>
    </MaxWidthWrapper>
  )
} 