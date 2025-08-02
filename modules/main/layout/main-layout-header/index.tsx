'use client'

import MaxWidthWrapper from '@/components/shared/max-width-wrapper'
import { useIndicatorPosition } from '@/hooks/use-indicator-position'
import { getActiveMainPath } from '@/lib/url'
import { cn } from '@/lib/utils'
import { motion } from 'motion/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Fragment, useRef } from 'react'

const RouteList = [
  {
    path: '/',
    pathName: 'Home',
  },
  {
    path: '/blog',
    pathName: 'Blog',
  },
  {
    path: '/note',
    pathName: 'Note',
  },
  {
    path: '/ai',
    pathName: 'AI',
  },
] as const

export default function MainLayoutHeader() {
  const pathname = usePathname()
  const activeUrl = getActiveMainPath(pathname)
  const refs = useRef(new Map<string, HTMLAnchorElement>())

  const indicatorStyle = useIndicatorPosition(activeUrl, refs)

  return (
    <header
      className="h-14 flex items-center justify-center sticky top-0 backdrop-blur-lg z-20
                border-b border-dashed dark:border-b-accent border-b-indigo-200"
    >
      <MaxWidthWrapper className="flex items-center justify-between">
        {/* 左侧和中间 - 导航菜单 */}
        <div className="flex-1 flex justify-center">
          <nav className="relative flex md:gap-16 gap-8">
            {RouteList.map(route => (
              <Fragment key={route.path}>
                <Link
                  href={route.path}
                  ref={(el) => {
                    if (el)
                      refs.current.set(route.path, el)
                  }}
                  className={cn(
                    'relative md:text-xl px-4',
                    route.path === activeUrl
                    && 'text-purple-600 dark:text-emerald-300 font-bold',
                  )}
                >
                  <h2>{route.pathName}</h2>
                </Link>
              </Fragment>
            ))}

            {/* 指示条 */}
            <motion.div
              className="absolute bottom-0 h-[2px] bg-purple-600 dark:bg-emerald-300 rounded-full"
              animate={indicatorStyle}
              transition={{
                type: 'spring',
                stiffness: 120,
                damping: 16,
              }}
            />
          </nav>
        </div>

        {/* 右侧 - 天气插件 */}
        <div className="flex-shrink-0 hidden md:block">
          <div
            className="rounded-lg overflow-hidden bg-white shadow-sm border border-gray-200 dark:border-gray-500"
            dangerouslySetInnerHTML={{
              __html: `<iframe allowtransparency="true" frameborder="0" width="180" height="36" scrolling="no" src="//tianqi.2345.com/plugin/widget/index.htm?s=3&z=3&t=0&v=0&d=2&bd=0&k=000000&f=000000&ltf=009944&htf=cc0000&q=1&e=1&a=1&c=71920&w=180&h=36&align=center"></iframe>`,
            }}
          />
        </div>
      </MaxWidthWrapper>
    </header>
  )
}
