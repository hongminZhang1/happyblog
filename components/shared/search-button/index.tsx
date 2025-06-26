'use client'

import SearchModal from '@/components/shared/search-modal'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { useState } from 'react'

export default function SearchButton() {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setSearchOpen(true)}
        className="gap-2"
      >
        <Search className="w-4 h-4" />
      </Button>

      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  )
}
