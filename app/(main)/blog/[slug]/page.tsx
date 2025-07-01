import { getPublishedBlogHTMLBySlug } from '@/actions/blogs'
import ArticleDisplayPage from '@/components/shared/article-display-page'
import CommentCard from '@/components/shared/comment-card'
import HorizontalDividingLine from '@/components/shared/horizontal-dividing-line'
import ScrollIndicator from '@/components/shared/scroll-indicator'
import { prisma } from '@/db'
import { notFound } from 'next/navigation'

export const dynamicParams = true

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const article = await getPublishedBlogHTMLBySlug((await params).slug)

  if (!article)
    notFound()

  return {
    title: article.title,
  }
}

export async function generateStaticParams() {
  const allArticles = await prisma.blog.findMany({
    where: {
      isPublished: true,
    },
  })

  return allArticles.map(article => ({
    slug: article.slug,
  }))
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const article = await getPublishedBlogHTMLBySlug((await params).slug)

  if (!article)
    notFound()

  const { content, title, createdAt, tags, id } = article

  const tagNames = tags.map(v => v.tagName)

  return (
    <div className="flex flex-col gap-4">
      <ArticleDisplayPage
        title={title}
        createdAt={createdAt}
        content={content}
        tags={tagNames}
      />
      <HorizontalDividingLine fill="#EC7FA9" />
      <CommentCard term={`${title}-blog-${id}`} />
      <ScrollIndicator />
    </div>
  )
}
