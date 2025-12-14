'use client'

import type {
  CarouselApi,
} from '@/components/ui/carousel'
import type { ReadingNoteTag } from '@prisma/client'
import type { Dispatch, SetStateAction } from 'react'
import { ReadingNoteTagItemToggle } from '@/components/shared/tag-item-toggle'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'
import { motion } from 'motion/react'
import { useEffect, useState } from 'react'

export function ReadingNoteTagsContainer({ readingNoteTagList, setSelectedTags }: { readingNoteTagList: ReadingNoteTag[], setSelectedTags: Dispatch<SetStateAction<string[]>> }) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(1)
  const [count, setCount] = useState(0)

  const readingNoteTags = readingNoteTagList.map(tag => tag.tagName)

  useEffect(() => {
    if (!api) {
      return
    }

    const updateCurrent = () => {
      setCurrent(api.selectedScrollSnap() + 1)
    }

    setCount(api.scrollSnapList().length)
    updateCurrent()

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })

    return () => {
      api.off('select', updateCurrent)
    }
  }, [api])

  return (
    <Carousel
      opts={{
        align: 'start',
        dragFree: true,
      }}
      className="w-full"
      setApi={setApi}
    >
      <CarouselContent className="p-0">
        {readingNoteTags.map(tagName => (
          <CarouselItem key={tagName} className="basis-auto p-0">
            <ReadingNoteTagItemToggle tagName={tagName} setSelectedTags={setSelectedTags} />
          </CarouselItem>
        ))}
      </CarouselContent>

      {
        readingNoteTags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="py-2 text-center text-sm text-muted-foreground"
          >
            标签
            {' '}
            <span
              className={cn(
                current === count
                  ? 'text-green-600 font-bold'
                  : 'text-red-600',
              )}
            >
              {current}
            </span>
            {' '}
            /
            {' '}
            {count}
          </motion.div>
        )
      }
    </Carousel>
  )
}