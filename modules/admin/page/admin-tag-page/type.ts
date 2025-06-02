import type { getAllTags } from '@/actions/tags'

export type Tag = Awaited<ReturnType<typeof getAllTags>>[number]
