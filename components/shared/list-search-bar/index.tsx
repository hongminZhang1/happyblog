'use client'

import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import * as motion from 'motion/react-client'

interface ListSearchBarProps {
  placeholder?: string
  defaultType?: 'blog' | 'note'
  className?: string
}

export default function ListSearchBar({ 
  placeholder = "搜索内容...", 
  defaultType,
  className = ""
}: ListSearchBarProps) {
  const [query, setQuery] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const router = useRouter()

  const handleSearch = () => {
    if (!query.trim()) return
    
    const params = new URLSearchParams()
    params.set('q', query)
    if (defaultType) {
      params.set('type', defaultType)
    }
    
    router.push(`/search?${params.toString()}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
    if (e.key === 'Escape') {
      setIsExpanded(false)
      setQuery('')
    }
  }

  return (
    <motion.div 
      className={`mb-6 ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3">
        {!isExpanded ? (
          <Button
            variant="outline"
            onClick={() => setIsExpanded(true)}
            className="flex items-center gap-2 ml-auto"
          >
            <Search className="w-4 h-4" />
            搜索{defaultType === 'blog' ? '博客' : defaultType === 'note' ? '笔记' : '内容'}
          </Button>
        ) : (
          <motion.div 
            className="flex items-center gap-3 w-full"
            initial={{ width: 'auto' }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex-1">
              <Input
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                className="w-full"
              />
            </div>
            <Button onClick={handleSearch} disabled={!query.trim()}>
              <Search className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => {
                setIsExpanded(false)
                setQuery('')
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
} 