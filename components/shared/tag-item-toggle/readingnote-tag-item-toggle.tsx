'use client'

import type { Dispatch, SetStateAction } from 'react'
import { Toggle } from '@/components/ui/toggle'

export function ReadingNoteTagItemToggle({
  tagName,
  setSelectedTags,
}: {
  tagName: string
  setSelectedTags: Dispatch<SetStateAction<string[]>>
}) {
  return (
    <Toggle
      variant="outline"
      size="sm"
      className="cursor-pointer"
      onPressedChange={(selected) => {
        setSelectedTags(beforeSelectedTags => selected ? [...beforeSelectedTags, tagName] : beforeSelectedTags.filter(t => t !== tagName))
      }}
    >
      {tagName}
    </Toggle>
  )
}
