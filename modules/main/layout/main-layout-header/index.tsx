'use client'

import MaxWidthWrapper from '@/components/shared/max-width-wrapper'
import { useIndicatorPosition } from '@/hooks/use-indicator-position'
import { getActiveMainPath } from '@/lib/url'
import { cn } from '@/lib/utils'
import { motion } from 'motion/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Fragment, memo, useRef } from 'react'

const RouteList = [
  {
    path: '/',
    pathName: 'Home',
  },
  {
    path: '/writeup',
    pathName: 'WriteUp',
  },
  {
    path: '/ai',
    pathName: 'AI',
  },
] as const

// 天气插件HTML内容 - 提取到组件外部避免重复创建
const WEATHER_WIDGET_HTML = `<iframe allowtransparency="true" frameborder="0" width="180" height="36" scrolling="no" src="//tianqi.2345.com/plugin/widget/index.htm?s=3&z=3&t=0&v=0&d=2&bd=0&k=000000&f=000000&ltf=009944&htf=cc0000&q=1&e=1&a=1&c=71920&w=180&h=36&align=center"></iframe>`

// 天气插件组件 - 使用memo优化
const WeatherWidget = memo(() => (
  <div className="flex-shrink-0 hidden md:block">
    <div
      className="rounded-lg overflow-hidden bg-white shadow-sm border border-gray-200 dark:border-gray-500"
      dangerouslySetInnerHTML={{ __html: WEATHER_WIDGET_HTML }}
    />
  </div>
))

WeatherWidget.displayName = 'WeatherWidget'

function MainLayoutHeader() {
  const pathname = usePathname()
  const activeUrl = getActiveMainPath(pathname)
  const refs = useRef(new Map<string, HTMLAnchorElement>())

  const indicatorStyle = useIndicatorPosition(activeUrl, refs)

  return (
    <header
      className="h-14 flex items-center justify-center sticky top-0 backdrop-blur-lg z-20
                border-b border-dashed dark:border-b-accent border-b-indigo-200"
    >
      <MaxWidthWrapper className="flex items-center justify-center">
        {/* 导航菜单 */}
        <nav className="relative flex md:gap-10 gap-6">
          {RouteList.map(route => (
            <Fragment key={route.path}>
              <Link
                href={route.path}
                ref={(el) => {
                  if (el)
                    refs.current.set(route.path, el)
                }}
                className={cn(
                  'relative md:text-xl px-2',
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

        {/* 右侧 - 天气插件 */}
        <div className="ml-8">
          <WeatherWidget />
        </div>
      </MaxWidthWrapper>
    </header>
  )
}

// 使用memo优化整个头部组件，避免不必要的重新渲染
export default memo(MainLayoutHeader)
