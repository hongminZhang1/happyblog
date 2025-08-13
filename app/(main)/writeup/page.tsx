'use client'

import MaxWidthWrapper from '@/components/shared/max-width-wrapper'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, BookOpen } from 'lucide-react'
import Link from 'next/link'

export default function WriteUpPage() {
  const sections = [
    {
      title: 'Blog',
      description: '技术博客和文章分享',
      icon: FileText,
      href: '/blog',
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Note',
      description: '学习笔记和心得记录',
      icon: BookOpen,
      href: '/note',
      color: 'text-green-600 dark:text-green-400'
    }
  ]

  return (
    <MaxWidthWrapper className="py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">WriteUp</h1>
        <p className="text-lg text-muted-foreground">
          技术分享与学习记录
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        {sections.map((section) => {
          const Icon = section.icon
          return (
            <Card key={section.title} className="hover:shadow-lg transition-shadow">
              <Link href={section.href}>
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <Icon className={`w-12 h-12 ${section.color}`} />
                  </div>
                  <CardTitle className="text-2xl">{section.title}</CardTitle>
                  <CardDescription className="text-base">
                    {section.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button variant="outline" className="w-full">
                    进入{section.title}
                  </Button>
                </CardContent>
              </Link>
            </Card>
          )
        })}
      </div>
    </MaxWidthWrapper>
  )
}
