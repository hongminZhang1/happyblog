'use client'

import MaxWidthWrapper from '@/components/shared/max-width-wrapper'
import * as motion from 'motion/react-client'

const containerVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: [-10, 0],
    transition: {
      duration: 0.6,
      ease: 'easeOut',
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
      delay: 0.2,
    },
  },
}

export default function AiPage() {
  return (
    <MaxWidthWrapper className="py-8">
      <motion.main
        className="flex flex-col items-center gap-8 max-w-4xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* 标题部分 */}
        <motion.div 
          className="text-center space-y-4"
          variants={itemVariants}
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-emerald-400 bg-clip-text text-transparent">
            AI 智能助手
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            与智能AI对话，获得编程、技术和创意方面的帮助
          </p>
        </motion.div>

        {/* 功能介绍 */}
        <motion.div 
          className="grid md:grid-cols-2 gap-6 w-full"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
              },
            },
          }}
        >
          <motion.div
            className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow"
            variants={itemVariants}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <span className="text-xl">💬</span>
              </div>
              <h3 className="text-xl font-semibold">智能对话</h3>
            </div>
            <p className="text-muted-foreground">
              支持自然语言对话，回答您关于编程、技术选型、代码优化等各种问题
            </p>
          </motion.div>

          <motion.div
            className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow"
            variants={itemVariants}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                <span className="text-xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold">代码助手</h3>
            </div>
            <p className="text-muted-foreground">
              提供代码审查、bug修复建议、性能优化方案等专业的编程辅助
            </p>
          </motion.div>

          <motion.div
            className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow"
            variants={itemVariants}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <span className="text-xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold">项目规划</h3>
            </div>
            <p className="text-muted-foreground">
              协助项目架构设计、技术栈选择、开发流程规划等战略性决策
            </p>
          </motion.div>

          <motion.div
            className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow"
            variants={itemVariants}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                <span className="text-xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold">学习伙伴</h3>
            </div>
            <p className="text-muted-foreground">
              个性化学习建议、技术概念解释、最佳实践分享，助力技能提升
            </p>
          </motion.div>
        </motion.div>

        {/* 即将推出提示 */}
        <motion.div
          className="bg-gradient-to-r from-purple-50 to-emerald-50 dark:from-purple-950/20 dark:to-emerald-950/20 
                     border border-purple-200 dark:border-purple-800 rounded-lg p-6 text-center w-full max-w-2xl"
          variants={itemVariants}
        >
          <h3 className="text-xl font-semibold mb-2 text-purple-800 dark:text-purple-300">
            🚀 即将推出
          </h3>
          <p className="text-purple-700 dark:text-purple-400">
            AI助手功能正在开发中，敬请期待更强大的智能对话体验！
          </p>
        </motion.div>
      </motion.main>
    </MaxWidthWrapper>
  )
} 