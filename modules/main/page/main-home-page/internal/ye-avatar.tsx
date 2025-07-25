'use client'

import avatar from '@/config/img/avatar.jpg'
import { useTransitionTheme } from '@/hooks/use-transition-theme'
import { motion } from 'motion/react'
import Image from 'next/image'

export default function YeAvatar() {
  const { setTransitionTheme, theme } = useTransitionTheme()

  return (
    // 摸摸头~
    // * 拍拍头切换亮暗模式~
    <motion.figure
      className="relative cursor-grab  drop-shadow-2xl active:drop-shadow-purple-300 dark:active:drop-shadow-emerald-300"
      onDoubleClick={() =>
        setTransitionTheme(theme === 'light' ? 'dark' : 'light')}
      whileTap={{ scale: 0.99, rotate: 1 }}
      drag
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragTransition={{ bounceStiffness: 500, bounceDamping: 15 }}
      dragElastic={0.2}
    >
      <Image
        src={avatar}
        alt="avatar"
        className="rounded-full md:w-52 w-44"
        placeholder="blur"
        priority
      />
      {/* 亮模式宽度为 2, 暗模式宽度为 4, 视觉效果 */}
      <span
        className="absolute left-0 top-0 size-full rounded-full
                    ring-2 dark:ring-4
                  ring-pink-600 dark:ring-blue-800
                    ring-offset-1 animate-ye-ping-one-dot-one"
      />
    </motion.figure>
  )
}
