export type SearchType = 'blog' | 'note' | 'all'

export interface SearchResult {
  type: 'blog' | 'note'
  id: number
  title: string
  slug: string
  content: string
  createdAt: Date
  tags: Array<{ tagName: string }>
}

export interface SearchParams {
  query: string
  type: SearchType
  page?: number
  limit?: number
}
