'use client'

import MaxWidthWrapper from '@/components/shared/max-width-wrapper'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import * as motion from 'motion/react-client'
import { useEffect, useRef, useState } from 'react'

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

const chatVariants = {
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

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

export default function AiPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // 客户端挂载后初始化消息，避免水合错误
  useEffect(() => {
    setMessages([
      {
        id: '1',
        content: '您好！我是AI智能助手，很高兴为您服务。请问有什么可以帮助您的吗？',
        role: 'assistant',
        timestamp: new Date(),
      },
    ])
  }, [])

  // 自动滚动到底部
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      // 获取ScrollArea内部的滚动容器
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }

  // 当消息更新时自动滚动到底部
  useEffect(() => {
    // 使用setTimeout确保DOM更新后再滚动
    setTimeout(scrollToBottom, 100)
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim())
      return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      // 调用真实的AI API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '请求失败')
      }

      const data = await response.json()

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.content,
        role: 'assistant',
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, aiMessage])
    }
    catch (error) {
      console.error('AI聊天错误:', error)

      // 显示错误消息
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `抱歉，遇到了错误: ${error instanceof Error ? error.message : '未知错误'}。请检查API配置或稍后重试。`,
        role: 'assistant',
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, errorMessage])
    }
    finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <MaxWidthWrapper className="py-4">
      <motion.main
        className="flex flex-col items-center gap-4 max-w-6xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        style={{ height: 'calc(100vh - 4rem)' }}
      >
        {/* 标题部分 */}
        <motion.div
          className="text-center space-y-1 flex-shrink-0"
          variants={chatVariants}
        >
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-emerald-400 bg-clip-text text-transparent">
            Talk to AI
          </h1>
          <p className="text-sm text-muted-foreground">
            与AI对话，获得编程和技术方面的帮助(内置Spark Pro模型)
          </p>
        </motion.div>

        {/* 聊天容器 */}
        <motion.div
          className="w-full bg-card border rounded-lg shadow-lg flex flex-col overflow-hidden"
          style={{ height: '75vh' }}
          variants={chatVariants}
        >
          {/* 消息显示区域 */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea
              className="h-full"
              ref={scrollAreaRef}
            >
              <div className="p-4">
                <div className="space-y-4">
                  {messages.map(message => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] px-4 py-3 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-purple-600 text-white'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  ))}

                  {/* 加载状态 */}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted px-4 py-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          </div>
                          <span className="text-xs text-muted-foreground">AI正在思考...</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 滚动到底部的参考点 - 不再需要 */}
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* 输入区域 - 固定在底部 */}
          <div className="border-t p-4 flex-shrink-0 bg-background">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入您的问题..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6"
              >
                发送
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              按 Enter 发送消息，Shift + Enter 换行
            </p>
          </div>
        </motion.div>
      </motion.main>
    </MaxWidthWrapper>
  )
}
