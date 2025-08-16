import ScaleUnderline from '@/components/shared/scale-underline'
import { toZhDay } from '@/lib/time'
import Link from 'next/link'

export default function NoteListItem({
  noteTitle,
  createdAt,
  slug,
}: {
  noteTitle: string
  createdAt: Date
  slug: string
}) {
  return (
    <Link
      href={`/w/note/${slug}`}
      className="block p-4 mb-2 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer
                hover:border-purple-300 dark:hover:border-emerald-300 hover:shadow-md
                transition-all duration-300 group bg-white dark:bg-gray-800"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-emerald-300 transition-colors">
          {noteTitle}
        </h2>
        <time className="text-sm text-gray-500 dark:text-gray-400">
          {toZhDay(createdAt)}
        </time>
      </div>
    </Link>
  )
}
