import { Search } from 'lucide-react'
import { Card } from '@/components/ui/card'
import MaxWidthWrapper from '@/components/shared/max-width-wrapper'

interface SearchPageProps {
  searchParams?: { q?: string, type?: string }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams?.q || ''
  const type = searchParams?.type || 'all'

  return (
    <MaxWidthWrapper className="py-8">
      <div className="space-y-6">
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold mb-2">搜索结果</h1>
          {query && (
            <p className="text-muted-foreground">
              搜索关键词: "{query}"
              {type !== 'all' && ` 在 ${type === 'blog' ? '博客' : '笔记'} 中`}
            </p>
          )}
        </div>

        <div className="grid gap-4">
          <Card className="p-6 text-center">
            <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              {query ? '搜索功能正在开发中...' : '输入关键词开始搜索'}
            </p>
          </Card>
        </div>
      </div>
    </MaxWidthWrapper>
  )
} 