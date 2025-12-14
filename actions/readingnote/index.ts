'use server'

import type { ArticleDTO, UpdateArticleDTO } from '@/components/shared/admin-article-edit-page/type'
import { prisma } from '@/db'
import { requireAdmin } from '@/lib/auth'
import { processor } from '@/lib/markdown'
import { revalidatePath } from 'next/cache'

export async function createReadingNote(values: ArticleDTO) {
  await requireAdmin()

  const existingNote = await prisma.readingNote.findUnique({
    where: { slug: values.slug },
  })

  if (existingNote) {
    throw new Error('该 slug 已存在')
  }

  const relatedTags = await prisma.readingNoteTag.findMany({
    where: {
      tagName: {
        in: values.relatedTagNames,
      },
    },
    select: { id: true },
  })

  if (relatedTags.length > 3) {
    throw new Error('标签数量超过 3 个限制')
  }

  revalidatePath('/w/readingnote')
  revalidatePath('/admin/readingnote')

  return await prisma.readingNote.create({
    data: {
      title: values.title,
      slug: values.slug,
      isPublished: values.isPublished,
      content: values.content,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: {
        connect: relatedTags.map(tag => ({ id: tag.id })),
      },
    },
    include: {
      tags: true,
    },
  })
}

export async function deleteReadingNoteById(noteId: number) {
  await requireAdmin()

  revalidatePath('/w/readingnote')
  revalidatePath('/admin/readingnote')

  return prisma.readingNote.delete({
    where: {
      id: noteId,
    },
  })
}

export async function toggleReadingNotePublishedById(id: number, newIsPublishedStatus: boolean) {
  await requireAdmin()

  revalidatePath('/w/readingnote')
  revalidatePath('/admin/readingnote')

  return await prisma.readingNote.update({
    where: {
      id,
    },
    data: {
      isPublished: newIsPublishedStatus,
    },
  })
}

export async function updateReadingNoteById(values: UpdateArticleDTO) {
  await requireAdmin()

  const [existingNote, relatedTags, currentTags] = await Promise.all([
    prisma.readingNote.findUnique({
      where: {
        slug: values.slug,
        NOT: {
          id: values.id,
        },
      },
    }),
    prisma.readingNoteTag.findMany({
      where: {
        tagName: {
          in: values.relatedTagNames,
        },
      },
      select: { id: true },
    }),
    prisma.readingNote.findUnique({
      where: { id: values.id },
      include: { tags: true },
    }),
  ])

  if (existingNote) {
    throw new Error('该 slug 已存在')
  }

  if (relatedTags.length > 3) {
    throw new Error('标签数量超过 3 个限制')
  }

  if (!currentTags) {
    throw new Error('阅读笔记不存在')
  }

  revalidatePath('/w/readingnote')
  revalidatePath('/admin/readingnote')

  return await prisma.readingNote.update({
    where: { id: values.id },
    data: {
      title: values.title,
      slug: values.slug,
      isPublished: values.isPublished,
      content: values.content,
      updatedAt: new Date(),
      tags: {
        disconnect: currentTags.tags.map(tag => ({ id: tag.id })),
        connect: relatedTags.map(tag => ({ id: tag.id })),
      },
    },
    include: {
      tags: true,
    },
  })
}

export async function getPublishedReadingNotesWithPagination(page: number, limit: number, tagId?: number) {
  const offset = (page - 1) * limit

  const [readingNotes, totalCount] = await Promise.all([
    prisma.readingNote.findMany({
      where: {
        isPublished: true,
        ...(tagId && {
          tags: {
            some: { id: tagId },
          },
        }),
      },
      include: {
        tags: true,
      },
      skip: offset,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.readingNote.count({
      where: {
        isPublished: true,
        ...(tagId && {
          tags: {
            some: { id: tagId },
          },
        }),
      },
    }),
  ])

  return { readingNotes, totalCount }
}

export async function getAllReadingNotesWithPagination(page: number, limit: number) {
  const offset = (page - 1) * limit

  const [readingNotes, totalCount] = await Promise.all([
    prisma.readingNote.findMany({
      include: {
        tags: true,
      },
      skip: offset,
      take: limit,
      orderBy: {
        updatedAt: 'desc',
      },
    }),
    prisma.readingNote.count(),
  ])

  return { readingNotes, totalCount }
}

export async function getPublishedReadingNoteHTMLBySlug(slug: string) {
  const readingNote = await prisma.readingNote.findUnique({
    where: {
      slug,
      isPublished: true,
    },
    include: {
      tags: true,
    },
  })

  if (!readingNote) {
    return null
  }

  const processedContent = await processor.process(readingNote.content)

  return {
    id: readingNote.id,
    title: readingNote.title,
    content: processedContent.toString(),
    createdAt: readingNote.createdAt,
    updatedAt: readingNote.updatedAt,
    tags: readingNote.tags,
  }
}

export async function getReadingNoteBySlug(slug: string) {
  return await prisma.readingNote.findUnique({
    where: {
      slug,
    },
    include: {
      tags: true,
    },
  })
}

export async function getReadingNoteList() {
  return await prisma.readingNote.findMany({
    include: {
      tags: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  })
}

export async function getQueryReadingNotes(query: string) {
  return await prisma.readingNote.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
      ],
    },
    include: {
      tags: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  })
}

export async function getReadingNotesBySelectedTagName(tagNames: string[]) {
  return await prisma.readingNote.findMany({
    where: {
      tags: {
        some: {
          tagName: {
            in: tagNames,
          },
        },
      },
    },
    include: {
      tags: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  })
}

export async function getAllShowReadingNotes() {
  return await prisma.readingNote.findMany({
    where: {
      isPublished: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}