'use client'

import { useState, useEffect, useMemo } from 'react'
import { Search, FileText, BookOpen, Calendar, Tag } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { searchContent, type SearchResult, type SearchType } from '@/actions/search'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import * as motion from 'motion/react-client'

interface SearchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [searchType, setSearchType] = useState<SearchType>('all')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // 防抖搜索
  const debouncedQuery = useMemo(() => {
    const handler = setTimeout(() => query, 300)
    return () => clearTimeout(handler)
  }, [query])

  useEffect(() => {
    const searchData = async () => {
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

    const timeoutId = setTimeout(searchData, 300)
    return () => clearTimeout(timeoutId)
  }, [query, searchType])

  const handleResultClick = (result: SearchResult) => {
    onOpenChange(false)
    router.push(`/${result.type}/${result.slug}`)
    setQuery('')
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
    if (!query.trim()) return content.slice(0, 150) + '...'
    
    const index = content.toLowerCase().indexOf(query.toLowerCase())
    if (index === -1) return content.slice(0, 150) + '...'
    
    const start = Math.max(0, index - 50)
    const end = Math.min(content.length, index + query.length + 100)
    const preview = content.slice(start, end)
    
    return (start > 0 ? '...' : '') + preview + (end < content.length ? '...' : '')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            搜索内容
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <Input
              placeholder="搜索标题或内容..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full"
              autoFocus
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
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>未找到相关内容</p>
            </div>
          )}

          {!loading && !query && (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>输入关键词开始搜索</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {results.map((result, index) => (
                <motion.div
                  key={`${result.type}-${result.id}`}
                  className="p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                  onClick={() => handleResultClick(result)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {result.type === 'blog' ? (
                        <FileText className="w-5 h-5 text-blue-500" />
                      ) : (
                        <BookOpen className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={result.type === 'blog' ? 'default' : 'secondary'}>
                          {result.type === 'blog' ? '博客' : '笔记'}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {new Date(result.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <h3 className="font-medium text-lg mb-2 line-clamp-1">
                        {highlightText(result.title, query)}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {highlightText(getContentPreview(result.content, query), query)}
                      </p>
                      
                      {result.tags.length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap">
                          <Tag className="w-3 h-3 text-muted-foreground" />
                          {result.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag.tagName} variant="outline" className="text-xs">
                              {tag.tagName}
                            </Badge>
                          ))}
                          {result.tags.length > 3 && (
                            <span className="text-xs text-muted-foreground">+{result.tags.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        <div className="text-xs text-muted-foreground text-center pt-3 border-t">
          按 ESC 键关闭搜索
        </div>
      </DialogContent>
    </Dialog>
  )
} 