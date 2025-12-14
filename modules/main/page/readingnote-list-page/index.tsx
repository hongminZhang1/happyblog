import { getAllShowReadingNotes } from '@/actions/readingnote'
import * as motion from 'motion/react-client'
import ReadingNoteListItem from './internal/readingnote-list-item'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: [30, -8, 0],
    transition: {
      type: 'tween',
      ease: 'easeInOut',
      duration: 0.8,
    },
  },
}

export default async function ReadingNoteListPage() {
  const allReadingNotes = await getAllShowReadingNotes()

  if (allReadingNotes.length === 0) {
    return <p className="m-auto">虚无。</p>
  }

  return (
    <div className="flex flex-col px-4 py-8">
      <motion.main
        className="flex flex-col max-w-2xl mx-auto w-full"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {allReadingNotes.map(v => (
          <motion.div variants={itemVariants} key={v.id}>
            <ReadingNoteListItem
              readingNoteTitle={v.title}
              createdAt={v.createdAt}
              slug={v.slug}
            />
          </motion.div>
        ))}
      </motion.main>
    </div>
  )
}