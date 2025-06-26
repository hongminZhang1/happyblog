import { getAllPublishedEcho } from '@/actions/echos'
import HomeSearchSection from '@/components/shared/home-search-section'
import * as motion from 'motion/react-client'
import BioSection from './internal/bio-section'
import EchoCard from './internal/echo-card'
import TechStack from './internal/tech-stack'
import YeAvatar from './internal/ye-avatar'

export default async function MainLayoutContainer() {
  const allPublishedEcho = await getAllPublishedEcho()

  return (
    <motion.main
      className="flex flex-col justify-center items-center gap-6 py-4 overflow-hidden"
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: [-10, 0] }}
      transition={{
        duration: 0.6,
        ease: 'easeOut',
      }}
    >
      <YeAvatar />
      <BioSection />
      <HomeSearchSection />
      <EchoCard allPublishedEcho={allPublishedEcho} />
      <TechStack />
    </motion.main>
  )
}
