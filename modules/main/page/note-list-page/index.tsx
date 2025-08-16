import { getAllShowNotes } from '@/actions/notes'
import * as motion from 'motion/react-client'
import NoteListItem from './internal/note-list-item'

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

export default async function NoteListPage() {
  const allNotes = await getAllShowNotes()

  if (allNotes.length === 0) {
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
        {allNotes.map(v => (
          <motion.div variants={itemVariants} key={v.id}>
            <NoteListItem
              noteTitle={v.title}
              createdAt={v.createdAt}
              slug={v.slug}
            />
          </motion.div>
        ))}
      </motion.main>
    </div>
  )
}
