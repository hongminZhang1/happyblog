'use client'

import MaxWidthWrapper from '@/components/shared/max-width-wrapper'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { BookOpen, FileText } from 'lucide-react'
import Link from 'next/link'

export default function WriteUpPage() {
  const sections = [
    {
      title: 'Blog',
      description: '技术博客和文章分享',
      icon: FileText,
      href: '/w/blog',
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Note',
      description: '学习笔记和心得记录',
      icon: BookOpen,
      href: '/w/note',
      color: 'text-green-600 dark:text-green-400',
    },
  ]

  return (
    <MaxWidthWrapper className="py-4">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold mb-4">Write List</h1>
      </div>

      <div className="flex flex-col gap-2 max-w-2xl mx-auto">
        {sections.map((section) => {
          const Icon = section.icon
          return (
            <Card key={section.title} className="hover:shadow-lg transition-shadow">
              <Link href={section.href}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <Icon className={`w-8 h-8 ${section.color}`} />
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold">{section.title}</CardTitle>
                      <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                        {section.description}
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      进入
                    </Button>
                  </div>
                </CardContent>
              </Link>
            </Card>
          )
        })}
      </div>
    </MaxWidthWrapper>
  )
}
