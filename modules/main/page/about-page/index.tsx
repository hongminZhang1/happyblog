import HorizontalDividingLine from '@/components/shared/horizontal-dividing-line'
import MaxWidthWrapper from '@/components/shared/max-width-wrapper'
import { ArrowDownIcon } from 'lucide-react'
import * as motion from 'motion/react-client'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: [30, -8, 0], opacity: 1 }}
      transition={{
        duration: 0.6,
        ease: 'easeOut',
      }}
    >
      <MaxWidthWrapper className="md:text-lg text-center flex items-center justify-center flex-col gap-4 mt-4">
        <p>嘿, 你好呀~👋🏻</p>
        <h2>
          你可以叫我,
          {' '}
          <span className="font-bold text-purple-400">夜狗侠</span>
          {' '}
        </h2>
        <HorizontalDividingLine fill="#006A71" />

        <p>print("hello world")</p>

        <HorizontalDividingLine fill="#107B80" />

        <p>故天将降大任于斯人也</p>
        <p>必先苦其心志，劳其筋骨，饿其体肤，空乏其身,行拂乱其所为</p>
        <h2>所以动心忍性，曾益其所不能。</h2>

        <Link
          href="https://space.bilibili.com/3546620134165431?spm_id_from=333.1007.0.0"
          target="_blank"
          className="px-4 py-2 rounded-sm font-mono underline hover:text-pink-600 hover:cursor-pointer"
        >
          Hi~ My friend
        </Link>
      </MaxWidthWrapper>
    </motion.div>
  )
}
