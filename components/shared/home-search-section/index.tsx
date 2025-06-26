'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { type SearchType } from '@/actions/search'
import { useRouter } from 'next/navigation'
import * as motion from 'motion/react-client'

export default function HomeSearchSection() {
  const [query, setQuery] = useState('')
  const [searchType, setSearchType] = useState<SearchType>('all')
  const router = useRouter()

  const handleSearch = () => {
    if (!query.trim()) return
    
    const params = new URLSearchParams()
    params.set('q', query)
    if (searchType !== 'all') {
      params.set('type', searchType)
    }
    
    router.push(`/search?${params.toString()}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <motion.section 
      className="w-full max-w-2xl mx-auto px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="relative">
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10 rounded-2xl blur-xl"></div>
        
        <div className="relative bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold mb-2">搜索内容</h3>
            <p className="text-sm text-muted-foreground">探索博客文章和学习笔记</p>
          </div>
          
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="输入关键词搜索..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-10"
              />
            </div>
            
            <Select value={searchType} onValueChange={(value: SearchType) => setSearchType(value)}>
              <SelectTrigger className="w-28 h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="blog">博客</SelectItem>
                <SelectItem value="note">笔记</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              onClick={handleSearch} 
              disabled={!query.trim()}
              className="h-10 w-10 p-0"
              size="icon"
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.section>
  )
} 