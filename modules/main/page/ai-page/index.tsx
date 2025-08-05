'use client'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { customMarkdownTheme, processor } from '@/lib/markdown'
import { Check, Copy, Send, Trash2 } from 'lucide-react'
import * as motion from 'motion/react-client'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

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

interface AIModel {
  id: string
  name: string
  description: string
  apiEndpoint: string
}

// 可用的AI模型配置
const AI_MODELS: AIModel[] = [
  {
    id: 'spark',
    name: 'Spark',
    description: 'SparkAI智能助手',
    apiEndpoint: '/api/chat-spark',
  },
  // 将来可以在这里添加更多模型
  // {
  //   id: 'gpt',
  //   name: 'ChatGPT',
  //   description: 'OpenAI ChatGPT助手',
  //   apiEndpoint: '/api/chat-gpt'
  // }
]

// 根据模型生成初始消息的函数
function generateWelcomeMessage(model: AIModel): Message {
  return {
    id: '1',
    content: `您好！我是${model.description}，很高兴为您服务。请问有什么可以帮助您的吗？`,
    role: 'assistant' as const,
    timestamp: new Date(),
  }
}

// 消息组件，支持markdown渲染
function MessageComponent({
  message,
  renderMarkdown,
}: {
  message: Message
  renderMarkdown: (content: string) => Promise<string>
}) {
  const [renderedContent, setRenderedContent] = useState<string>('')
  const [isRendering, setIsRendering] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (message.role === 'assistant' && message.content) {
      const renderContent = async () => {
        setIsRendering(true)
        try {
          const content = await renderMarkdown(message.content)
          setRenderedContent(content)
        }
        finally {
          setIsRendering(false)
        }
      }

      // 为了流式响应，添加防抖以避免频繁渲染
      const timeoutId = setTimeout(renderContent, 50)
      return () => clearTimeout(timeoutId)
    }
  }, [message.content, message.role, renderMarkdown])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000) // 2秒后重置状态
    }
    catch (error) {
      console.error('复制失败:', error)
    }
  }

  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[100%] px-4 py-3 rounded-lg relative group ${
          message.role === 'user'
            ? 'bg-purple-600 text-white'
            : 'bg-muted text-foreground'
        }`}
      >
        {message.role === 'user'
          ? (
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            )
          : (
              <div className="text-sm">
                {isRendering
                  ? (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    )
                  : (
                      <div
                        className={`${customMarkdownTheme} !prose-sm [&>*]:!text-sm [&_h1]:!text-lg [&_h2]:!text-base [&_h3]:!text-sm [&_h4]:!text-sm [&_h5]:!text-xs [&_h6]:!text-xs [&_pre]:!text-xs md:[&_pre]:!text-sm [&_code]:!text-xs md:[&_code]:!text-sm [&_pre_code]:!text-xs md:[&_pre_code]:!text-sm`}
                        dangerouslySetInnerHTML={{ __html: renderedContent || message.content }}
                      />
                    )}

                {/* 复制按钮 - 只在AI回答时显示 */}
                <Button
                  onClick={handleCopy}
                  size="icon"
                  variant="ghost"
                  className="absolute bottom-2 right-2 h-6 w-6 rounded-full bg-background/80 hover:bg-background/90 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {copied
                    ? (
                        <Check className="h-3 w-3 text-green-600" />
                      )
                    : (
                        <Copy className="h-3 w-3" />
                      )}
                </Button>
              </div>
            )}
      </div>
    </div>
  )
}

export default function AiPage() {
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState<string>('spark')
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // 密码验证状态
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [isAuthLoading, setIsAuthLoading] = useState(false)

  // 获取当前选择的模型信息
  const currentModel = AI_MODELS.find(model => model.id === selectedModel) || AI_MODELS[0]

  // 用户消息状态
  const [userMessages, setUserMessages] = useState<Message[]>([])

  // 使用useMemo计算消息列表，包含欢迎消息
  const messages = useMemo(() => {
    const welcomeMessage = generateWelcomeMessage(currentModel)
    return [welcomeMessage, ...userMessages]
  }, [currentModel, userMessages])

  // 渲染markdown内容
  const renderMarkdown = async (content: string) => {
    try {
      const result = await processor.process(content)
      return result.toString()
    }
    catch (error) {
      console.error('Markdown渲染错误:', error)
      return content // 如果渲染失败，返回原始内容
    }
  }

  // 模型切换时自动清除消息 - 在切换函数中处理

  // 自动滚动到底部
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }

  // 当消息更新时自动滚动到底部
  useEffect(() => {
    // 使用setTimeout确保DOM更新后再滚动
    const timer = setTimeout(scrollToBottom, 100)
    return () => clearTimeout(timer)
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

    setUserMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // 创建一个空的AI消息，用于流式更新
    const aiMessageId = (Date.now() + 1).toString()
    const initialAiMessage: Message = {
      id: aiMessageId,
      content: '',
      role: 'assistant',
      timestamp: new Date(),
    }

    setUserMessages(prev => [...prev, initialAiMessage])

    try {
      // 使用流式响应
      const response = await fetch(currentModel.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
          model: selectedModel,
          stream: true, // 启用流式响应
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '请求失败')
      }

      // 处理流式响应
      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('无法获取响应流')
      }

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done)
          break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || '' // 保留不完整的行

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              setIsLoading(false)
              return
            }

            try {
              const parsed = JSON.parse(data)
              if (parsed.content) {
                // 实时更新AI消息内容
                setUserMessages(prev =>
                  prev.map(msg =>
                    msg.id === aiMessageId
                      ? { ...msg, content: msg.content + parsed.content }
                      : msg,
                  ),
                )
              }
            }
            catch {
              // 忽略解析错误
            }
          }
        }
      }
    }
    catch (error) {
      console.error('AI聊天错误:', error)

      // 更新AI消息为错误消息
      const errorContent = `抱歉，遇到了错误: ${error instanceof Error ? error.message : '未知错误'}。请检查API配置或稍后重试。`

      setUserMessages(prev =>
        prev.map(msg =>
          msg.id === aiMessageId
            ? { ...msg, content: errorContent }
            : msg,
        ),
      )
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

  const handleClearMessages = useCallback(() => {
    setUserMessages([]) // 清空用户消息，欢迎消息会自动显示
  }, [])

  // 处理模型切换
  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId)
    setUserMessages([]) // 切换模型时清空用户消息
  }

  // 密码验证函数
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password.trim())
      return

    setIsAuthLoading(true)
    setAuthError('')

    try {
      const response = await fetch('/api/ai-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setIsAuthenticated(true)
        setPassword('')
      }
      else {
        setAuthError(data.error || '密码错误')
      }
    }
    catch {
      setAuthError('验证失败，请重试')
    }
    finally {
      setIsAuthLoading(false)
    }
  }

  // 如果未认证，显示密码输入界面
  if (!isAuthenticated) {
    return (
      <motion.main
        className="flex flex-col items-center justify-center gap-4 py-2"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div
          className="w-full max-w-md bg-card border rounded-lg shadow-lg p-6"
          variants={chatVariants}
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">AI助手访问</h2>
            <p className="text-muted-foreground">请输入访问密码</p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="请输入密码"
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                disabled={isAuthLoading}
              />
            </div>

            {authError && (
              <p className="text-sm text-red-600 text-center">{authError}</p>
            )}

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              disabled={isAuthLoading || !password.trim()}
            >
              {isAuthLoading ? '验证中...' : '进入AI助手'}
            </Button>
          </form>
        </motion.div>
      </motion.main>
    )
  }

  return (
    <motion.main
      className="flex flex-col items-center justify-center gap-4 py-2"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* 聊天容器 */}
      <motion.div
        className="w-full max-w-6xl bg-card border rounded-lg shadow-lg flex flex-col overflow-hidden"
        style={{ height: '85vh' }}
        variants={chatVariants}
      >
        {/* 消息显示区域 */}
        <div className="flex-1 overflow-hidden">
          <div
            className="overflow-y-auto chat-scroll-area"
            ref={scrollAreaRef}
            data-lenis-prevent
            style={{
              height: 'calc(65vh)', // 减去标题和输入框的高度
              scrollBehavior: 'smooth',
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(156, 163, 175, 0.4) transparent',
            }}
          >
            <div className="p-4">
              <div className="space-y-4">
                {messages.map(message => (
                  <MessageComponent key={message.id} message={message} renderMarkdown={renderMarkdown} />
                ))}

                {/* 加载状态 - 只在初始加载时显示 */}
                {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
                  <div className="flex justify-start">
                    <div className="bg-muted px-4 py-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          正在思考...
                        </span>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>

        {/* 输入区域 - 固定在底部 */}
        <div className="border-t p-4 flex-shrink-0 bg-background">
          {/* 输入框区域 */}
          <div className="mb-1">
            <textarea
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入任何问题..."
              className="w-full min-h-[80px] max-h-[200px] resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isLoading}
              rows={3}
            />
          </div>

          {/* 按钮控制区域 */}
          <div className="flex items-center justify-between">
            {/* 左侧按钮组 */}
            <div className="flex items-center gap-2">
              {/* 模型选择器 */}
              <Select value={selectedModel} onValueChange={handleModelChange} disabled={isLoading}>
                <SelectTrigger className="w-22">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AI_MODELS.map(model => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* 清空按钮 */}
              <Button
                onClick={handleClearMessages}
                disabled={isLoading}
                variant="outline"
                size="icon"
                className="h-9 w-9"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* 右侧发送按钮 */}
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-purple-600 hover:bg-purple-700 text-white h-9 w-9 rounded-full"
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          {/* <p className="text-xs text-muted-foreground mt-2 text-center">
            按 Enter 发送消息，Shift + Enter 换行 | 当前使用:
            {' '}
            {currentModel.name}
          </p> */}
        </div>
      </motion.div>
    </motion.main>
  )
}
