'use client'

import type { FC } from 'react'
import { ReactLenis } from 'lenis/react'

interface LenisScrollProviderProps {
  children: React.ReactNode
}
const LenisScrollProvider: FC<LenisScrollProviderProps> = ({ children }) => {
  return (
    <ReactLenis
      options={{
        duration: 1.2,
        easing: t => Math.min(1, 1.001 - 2 ** (-10 * t)),
      }}
      root
    >
      {children}
    </ReactLenis>
  )
}

export default LenisScrollProvider
