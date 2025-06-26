'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, FileText, BookOpen, Calendar, Tag } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import MaxWidthWrapper from '@/components/shared/max-width-wrapper'
import { searchContent, type SearchResult, type SearchType } from '@/actions/search'
import Link from 'next/link'
import * as motion from 'motion/react-client'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [searchType, setSearchType] = useState<SearchType>((searchParams.get('type') as SearchType) || 'all')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const searchResults = await searchContent(query, searchType)
      setResults(searchResults)
    } catch (error) {
      console.error('搜索失败:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (query) {
      handleSearch()
    }
  }, [searchType])

  useEffect(() => {
    const initialQuery = searchParams.get('q')
    if (initialQuery) {
      handleSearch()
    }
  }, [])

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
    if (!query.trim()) return content.slice(0, 200) + '...'
    
    const index = content.toLowerCase().indexOf(query.toLowerCase())
    if (index === -1) return content.slice(0, 200) + '...'
    
    const start = Math.max(0, index - 80)
    const end = Math.min(content.length, index + query.length + 120)
    const preview = content.slice(start, end)
    
    return (start > 0 ? '...' : '') + preview + (end < content.length ? '...' : '')
  }

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <MaxWidthWrapper className="py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6 text-center">搜索内容</h1>
          
          <div className="flex gap-3 mb-6 max-w-2xl mx-auto">
            <div className="flex-1">
              <Input
                placeholder="搜索标题或内容..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch()
                  }
                }}
                className="w-full"
              />
            </div>
            <Select value={searchType} onValueChange={(value: SearchType) => setSearchType(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="blog">博客</SelectItem>
                <SelectItem value="note">笔记</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} disabled={loading}>
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="min-h-[400px]">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-medium mb-2">未找到相关内容</h3>
              <p>尝试使用不同的关键词或者搜索类型</p>
            </div>
          )}

          {!loading && !query && (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-medium mb-2">输入关键词开始搜索</h3>
              <p>搜索博客文章和笔记的标题与内容</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-sm text-muted-foreground mb-4">
                找到 {results.length} 个结果
              </div>
              
              {results.map((result, index) => (
                <motion.article
                  key={`${result.type}-${result.id}`}
                  className="p-6 border rounded-lg hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link href={`/${result.type}/${result.slug}`} className="block group">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        {result.type === 'blog' ? (
                          <FileText className="w-6 h-6 text-blue-500" />
                        ) : (
                          <BookOpen className="w-6 h-6 text-green-500" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge variant={result.type === 'blog' ? 'default' : 'secondary'}>
                            {result.type === 'blog' ? '博客' : '笔记'}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {new Date(result.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <h2 className="text-xl font-semibold mb-3 group-hover:text-purple-600 dark:group-hover:text-emerald-300 transition-colors line-clamp-2">
                          {highlightText(result.title, query)}
                        </h2>
                        
                        <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                          {highlightText(getContentPreview(result.content, query), query)}
                        </p>
                        
                        {result.tags.length > 0 && (
                          <div className="flex items-center gap-2 flex-wrap">
                            <Tag className="w-4 h-4 text-muted-foreground" />
                            {result.tags.slice(0, 5).map((tag) => (
                              <Badge key={tag.tagName} variant="outline" className="text-xs">
                                {tag.tagName}
                              </Badge>
                            ))}
                            {result.tags.length > 5 && (
                              <span className="text-sm text-muted-foreground">+{result.tags.length - 5}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </motion.div>
          )}
        </div>
      </MaxWidthWrapper>
    </motion.div>
  )
} 