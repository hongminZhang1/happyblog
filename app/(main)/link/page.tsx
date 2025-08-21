'use client'

import type { StaticImageData } from 'next/image'

import MaxWidthWrapper from '@/components/shared/max-width-wrapper'
import { Card, CardContent } from '@/components/ui/card'
import avatar3 from '@/config/img/b站.png'
import avatar1 from '@/config/img/L站.jpg'
import avatar2 from '@/config/img/爬虫工具库.jpg'
import { ExternalLink } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface FriendLink {
  id: string
  title: string
  description: string
  url: string
  from: StaticImageData
}

const friendLinks: FriendLink[] = [
  {
    id: '1',
    title: 'L站',
    description: '真诚、友善、团结、专业的程序员社区',
    url: 'https://linux.do/',
    from: avatar1,
  },
  {
    id: '2',
    title: '爬虫工具库',
    description: '格式转换、编解码、参数提取等爬虫工具',
    url: 'https://spidertools.cn/#/urlParamsParse',
    from: avatar2,
  },
  {
    id: '3',
    title: 'b站弹幕查询工具',
    description: 'b站弹幕查询、音视频下载',
    url: 'https://bibz.me/',
    from: avatar3,
  },
]

export default function LinkPage() {
  return (
    <MaxWidthWrapper className="py-2">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">友情链接</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 max-w-6xl mx-auto">
        {friendLinks.map(link => (
          <Card key={link.id} className="hover:shadow-lg transition-all duration-300 hover:scale-105">
            <Link href={link.url} target="_blank" rel="noopener noreferrer">
              <CardContent className="p-2 text-center">
                {/* 图标 */}
                <div className="mb-4 flex justify-center">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Image
                      src={link.from}
                      alt={link.title}
                      width={60}
                      height={60}
                      className="rounded-full object-cover"
                    />
                  </div>
                </div>

                {/* 标题和描述 */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    {link.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {link.description}
                  </p>
                </div>

                {/* 点击图标 */}
                <div className="flex justify-center">
                  <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </MaxWidthWrapper>
  )
}
