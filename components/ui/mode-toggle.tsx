'use client'

import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTransitionTheme } from '@/hooks/use-transition-theme'
import { useEffect, useState } from 'react'

export function ModeToggle() {
  const { setTransitionTheme, theme } = useTransitionTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button size="sm" className='cursor-pointer'>
        <Sun />
      </Button>
    )
  }

  return (
    <Button
      onClick={() => setTransitionTheme(theme === 'light' ? 'dark' : 'light', theme === 'light' ? 'bottom' : 'top')}
      size="sm"
      className='cursor-pointer'
    >
      {theme === 'light' ? <Sun /> : <Moon />}
    </Button>
  )
}
