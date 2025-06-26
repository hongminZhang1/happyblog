'use client'

import SearchModal from '@/components/shared/search-modal'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import * as motion from 'motion/react-client'
import { useEffect, useState } from 'react'

export default function FloatingSearchButton() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      }
      else {
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    <>
      <motion.div
        className="fixed bottom-6 right-6 z-40"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? 1 : 0.8,
          y: isVisible ? 0 : 20,
        }}
        transition={{
          duration: 0.3,
          ease: 'easeInOut',
        }}
      >
        <Button
          size="lg"
          onClick={() => setSearchOpen(true)}
          className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-shadow bg-purple-600 hover:bg-purple-700 dark:bg-emerald-600 dark:hover:bg-emerald-700"
        >
          <Search className="w-6 h-6" />
        </Button>
      </motion.div>

      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  )
}
