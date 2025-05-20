'use client'

import type { Echo } from '@prisma/client'
import { getRandomPublishedEcho } from '@/actions/echos'
import { useEffect, useState } from 'react'

let cachedEcho: Echo | null = null

export default function EchoCard() {
  const [echo, setEcho] = useState<Echo | null>(cachedEcho)

  useEffect(() => {
    if (!cachedEcho) {
      getRandomPublishedEcho().then((res) => {
        if (res) {
          cachedEcho = res
          setEcho(res)
        }
      })
    }
  }, [])

  return (
    <section
      className="flex flex-col w-2/3 p-2 rounded-sm
                bg-slate-300/40 dark:bg-gray-900/30
                  backdrop-blur-3xl"
    >
      <p className="underline drop-shadow-[0_0_0.75rem_#211C84] dark:drop-shadow-[0_0_0.75rem_#91DDCF]">
        {echo?.content ?? '我在等网络加载，也在等你'}
      </p>
      <footer
        className="ml-auto text-sm font-thin text-pink-600 dark:text-emerald-300
                    drop-shadow-[0_0_0.75rem_#211C84] dark:drop-shadow-[0_0_0.75rem_#91DDCF]"
      >
        「
        {echo?.reference ?? '叶鱼'}
        」
      </footer>
    </section>
  )
}
