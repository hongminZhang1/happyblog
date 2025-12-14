import { TagType } from '@prisma/client'

export function getActiveAdminPath(pathname: string) {
  const currentActiveUrl = pathname.split('/').slice(0, 3).join('/')
  return currentActiveUrl
}

export function getActiveMainPath(pathname: string) {
  const currentActiveUrl = pathname.split('/').slice(0, 2).join('/')
  return currentActiveUrl
}

export function parseEditPageTypeFromUrl(url: string): TagType | 'READING_NOTE' {
  const type = url.split('/')[2].toUpperCase()
  if (type === TagType.BLOG || type === TagType.NOTE) {
    return type
  }
  if (type === 'READINGNOTE') {
    return 'READING_NOTE'
  }
  throw new Error(`解析编辑页面类型错误`)
}
