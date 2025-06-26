'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SearchModal from '@/components/shared/search-modal'

export default function SearchButton() {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setSearchOpen(true)}
        className="relative flex items-center gap-2 min-w-0 justify-start text-muted-foreground hover:text-foreground transition-colors"
      >
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline">搜索...</span>
      </Button>

      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  )
} 