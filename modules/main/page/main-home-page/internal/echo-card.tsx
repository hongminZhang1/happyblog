'use client'

import type { Echo } from '@prisma/client'
import { useRandomEchoIndexStore } from '@/store/use-display-echo-store'
import { use } from 'react'

export default function EchoCard({ allPublishedEcho }: { allPublishedEcho: Promise<Echo[]> }) {
  const echos = use(allPublishedEcho)
  const randomIndex = useRandomEchoIndexStore(s => s.randomIndex)
  const selectRandomIndex = useRandomEchoIndexStore(s => s.selectRandomIndex)

  if (randomIndex === null)
    selectRandomIndex(echos.length)

  const echo = echos[randomIndex ?? 0]

  return (
    <section
      className="flex flex-col w-2/3 p-2 rounded-sm
                bg-slate-300/40 dark:bg-gray-900/30
                  backdrop-blur-3xl"
    >
      <p suppressHydrationWarning className="underline drop-shadow-[0_0_0.75rem_#211C84] dark:drop-shadow-[0_0_0.75rem_#91DDCF]">
        {echo?.content ?? '虚无。'}
      </p>
      <footer
        suppressHydrationWarning
        className="ml-auto text-sm font-thin text-pink-600 dark:text-emerald-300
                    drop-shadow-[0_0_0.75rem_#211C84] dark:drop-shadow-[0_0_0.75rem_#91DDCF]"
      >
        「
        {echo?.reference ?? '无名。'}
        」
      </footer>
    </section>
  )
}
