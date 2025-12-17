'use client'

/**
 * Demo de Componentes estilo prompt-kit / Cursor
 * 
 * Página de prueba para evaluar componentes de:
 * - Chat IA (estilo Cursor)
 * - Timeline/Flujo
 * - Markdown rendering
 * - Code blocks
 */

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from '@vibethink/ui'
import { Button } from '@vibethink/ui'
import { Badge } from '@vibethink/ui'
import { Separator } from '@vibethink/ui'
import { ScrollArea } from '@vibethink/ui'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@vibethink/ui'
import { 
  Send, 
  Sparkles, 
  Copy, 
  Check, 
  ChevronDown,
  Bot,
  User,
  Clock,
  CheckCircle2,
  Circle,
  ArrowRight,
  Code,
  FileText,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Paperclip
} from 'lucide-react'
import { cn } from '@/lib/utils'

// =============================================================================
// TIPOS
// =============================================================================

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  isStreaming?: boolean
}

interface TimelineStep {
  id: string
  title: string
  description: string
  status: 'completed' | 'in-progress' | 'pending'
  timestamp?: Date
}

// =============================================================================
// COMPONENTES DE CHAT (estilo Cursor)
// =============================================================================

/**
 * PromptInput - Input estilo Cursor/prompt-kit
 */
function PromptInput({ 
  onSend, 
  disabled = false,
  placeholder = "Ask me anything..."
}: { 
  onSend: (message: string) => void
  disabled?: boolean
  placeholder?: string
}) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
    }
  }, [value])

  const handleSubmit = () => {
    if (value.trim() && !disabled) {
      onSend(value.trim())
      setValue('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="relative border border-border rounded-xl bg-background/50 backdrop-blur-sm shadow-lg">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        className={cn(
          "w-full resize-none bg-transparent px-4 py-3 pr-24",
          "text-sm placeholder:text-muted-foreground",
          "focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          "min-h-[48px] max-h-[200px]"
        )}
      />
      <div className="absolute bottom-2 right-2 flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <Paperclip className="h-4 w-4" />
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!value.trim() || disabled}
          size="icon"
          className="h-8 w-8 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {disabled ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  )
}

/**
 * MessageBubble - Mensaje estilo Cursor
 */
function MessageBubble({ message }: { message: Message }) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn(
      "flex gap-3 p-4 rounded-lg",
      isUser ? "bg-muted/50" : "bg-background"
    )}>
      {/* Avatar */}
      <div className={cn(
        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
        isUser ? "bg-primary text-primary-foreground" : "bg-gradient-to-br from-violet-500 to-purple-600 text-white"
      )}>
        {isUser ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
      </div>

      {/* Content */}
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">
            {isUser ? 'You' : 'Assistant'}
          </span>
          <span className="text-xs text-muted-foreground">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* Message Content with Markdown-like rendering */}
        <div className="prose prose-sm dark:prose-invert max-w-none">
          {message.isStreaming ? (
            <div className="flex items-center gap-2">
              <span>{message.content}</span>
              <span className="inline-block w-2 h-4 bg-primary animate-pulse rounded-sm" />
            </div>
          ) : (
            <MarkdownRenderer content={message.content} />
          )}
        </div>

        {/* Actions */}
        {!isUser && !message.isStreaming && (
          <div className="flex items-center gap-1 pt-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
              onClick={handleCopy}
            >
              {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <ThumbsUp className="h-3 w-3 mr-1" />
              Good
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <ThumbsDown className="h-3 w-3 mr-1" />
              Bad
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * MarkdownRenderer - Renderizado simple de markdown
 */
function MarkdownRenderer({ content }: { content: string }) {
  // Detectar bloques de código
  const parts = content.split(/(```[\s\S]*?```)/g)

  return (
    <div className="space-y-3">
      {parts.map((part, index) => {
        if (part.startsWith('```')) {
          // Extraer lenguaje y código
          const match = part.match(/```(\w+)?\n?([\s\S]*?)```/)
          if (match) {
            const [, language, code] = match
            return (
              <CodeBlock key={index} code={code.trim()} language={language || 'text'} />
            )
          }
        }
        // Texto normal - procesar inline markdown
        return part.trim() ? (
          <p key={index} className="text-sm leading-relaxed whitespace-pre-wrap">
            {part}
          </p>
        ) : null
      })}
    </div>
  )
}

/**
 * CodeBlock - Bloque de código estilo Cursor
 */
function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group rounded-lg overflow-hidden border border-border bg-zinc-950">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-border">
        <div className="flex items-center gap-2">
          <Code className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-mono">{language}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleCopy}
        >
          {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </div>
      {/* Code */}
      <pre className="p-4 overflow-x-auto">
        <code className="text-sm font-mono text-zinc-100 leading-relaxed">
          {code}
        </code>
      </pre>
    </div>
  )
}

/**
 * PromptSuggestions - Sugerencias de prompts
 */
function PromptSuggestions({ 
  suggestions, 
  onSelect 
}: { 
  suggestions: string[]
  onSelect: (suggestion: string) => void 
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map((suggestion, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          className="text-xs h-8 rounded-full hover:bg-primary/10 hover:border-primary/50"
          onClick={() => onSelect(suggestion)}
        >
          <Sparkles className="h-3 w-3 mr-1.5 text-primary" />
          {suggestion}
        </Button>
      ))}
    </div>
  )
}

/**
 * ThinkingIndicator - Indicador de pensamiento
 */
function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-3 p-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
        <Sparkles className="h-4 w-4 text-white animate-pulse" />
      </div>
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        <span className="text-sm text-muted-foreground">Thinking...</span>
      </div>
    </div>
  )
}

/**
 * ScrollToBottom - Botón de scroll
 */
function ScrollToBottom({ 
  onClick, 
  visible 
}: { 
  onClick: () => void
  visible: boolean 
}) {
  if (!visible) return null

  return (
    <Button
      onClick={onClick}
      size="sm"
      variant="secondary"
      className="absolute bottom-20 left-1/2 -translate-x-1/2 rounded-full shadow-lg"
    >
      <ChevronDown className="h-4 w-4 mr-1" />
      Scroll to bottom
    </Button>
  )
}

// =============================================================================
// COMPONENTES DE TIMELINE/FLUJO
// =============================================================================

/**
 * Timeline - Componente de línea de tiempo
 */
function Timeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <div className="space-y-0">
      {steps.map((step, index) => (
        <TimelineItem 
          key={step.id} 
          step={step} 
          isLast={index === steps.length - 1}
        />
      ))}
    </div>
  )
}

/**
 * TimelineItem - Item de timeline
 */
function TimelineItem({ 
  step, 
  isLast 
}: { 
  step: TimelineStep
  isLast: boolean 
}) {
  const StatusIcon = {
    completed: CheckCircle2,
    'in-progress': Loader2,
    pending: Circle
  }[step.status]

  const statusColors = {
    completed: 'text-green-500 bg-green-500/10',
    'in-progress': 'text-blue-500 bg-blue-500/10',
    pending: 'text-muted-foreground bg-muted'
  }

  return (
    <div className="flex gap-4">
      {/* Línea y punto */}
      <div className="flex flex-col items-center">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center",
          statusColors[step.status]
        )}>
          <StatusIcon className={cn(
            "h-5 w-5",
            step.status === 'in-progress' && "animate-spin"
          )} />
        </div>
        {!isLast && (
          <div className={cn(
            "w-0.5 flex-1 min-h-[40px]",
            step.status === 'completed' ? "bg-green-500/50" : "bg-border"
          )} />
        )}
      </div>

      {/* Contenido */}
      <div className={cn(
        "flex-1 pb-8",
        isLast && "pb-0"
      )}>
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium text-sm">{step.title}</h4>
          {step.status === 'in-progress' && (
            <Badge variant="secondary" className="text-xs">In Progress</Badge>
          )}
          {step.status === 'completed' && (
            <Badge variant="outline" className="text-xs text-green-600 border-green-600/50">Completed</Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{step.description}</p>
        {step.timestamp && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {step.timestamp.toLocaleTimeString()}
          </p>
        )}
      </div>
    </div>
  )
}

/**
 * StepsIndicator - Indicador de pasos horizontal
 */
function StepsIndicator({ 
  steps, 
  currentStep 
}: { 
  steps: string[]
  currentStep: number 
}) {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className="flex flex-col items-center gap-2">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
              index < currentStep
                ? "bg-green-500 text-white"
                : index === currentStep
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}>
              {index < currentStep ? (
                <Check className="h-4 w-4" />
              ) : (
                index + 1
              )}
            </div>
            <span className={cn(
              "text-xs",
              index <= currentStep ? "text-foreground" : "text-muted-foreground"
            )}>
              {step}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className={cn(
              "flex-1 h-0.5 mx-2",
              index < currentStep ? "bg-green-500" : "bg-muted"
            )} />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

// =============================================================================
// COMPONENTE PRINCIPAL
// =============================================================================

export default function PromptKitDemoPage() {
  // Chat state
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Timeline state
  const [timelineSteps, setTimelineSteps] = useState<TimelineStep[]>([
    {
      id: '1',
      title: 'Analyzing request',
      description: 'Understanding the context and requirements',
      status: 'completed',
      timestamp: new Date(Date.now() - 60000)
    },
    {
      id: '2',
      title: 'Searching codebase',
      description: 'Finding relevant files and patterns',
      status: 'completed',
      timestamp: new Date(Date.now() - 30000)
    },
    {
      id: '3',
      title: 'Generating solution',
      description: 'Creating code based on best practices',
      status: 'in-progress'
    },
    {
      id: '4',
      title: 'Review & apply',
      description: 'Verify and apply changes to files',
      status: 'pending'
    }
  ])

  // Steps state
  const [currentStep, setCurrentStep] = useState(2)
  const stepsLabels = ['Analyze', 'Search', 'Generate', 'Apply', 'Done']

  // Suggestions
  const suggestions = [
    'How does this work?',
    'Explain this code',
    'Fix this bug',
    'Add tests',
    'Optimize performance'
  ]

  // Handlers
  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    // Simulate streaming response
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Add assistant message (streaming)
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true
    }
    setMessages(prev => [...prev, assistantMessage])

    // Simulate streaming
    const fullResponse = `I understand you want to know about "${content}".

Here's a code example:

\`\`\`typescript
function example() {
  // This is a sample function
  const data = fetchData();
  return processData(data);
}
\`\`\`

This approach follows best practices for:
- Clean code architecture
- Type safety with TypeScript
- Error handling

Let me know if you need more details!`

    let currentContent = ''
    for (const char of fullResponse) {
      currentContent += char
      setMessages(prev => prev.map(m => 
        m.id === assistantMessage.id 
          ? { ...m, content: currentContent }
          : m
      ))
      await new Promise(resolve => setTimeout(resolve, 10))
    }

    // Mark as complete
    setMessages(prev => prev.map(m => 
      m.id === assistantMessage.id 
        ? { ...m, isStreaming: false }
        : m
    ))
    setIsLoading(false)
  }

  const scrollToBottom = useCallback(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth'
    })
  }, [])

  // Auto-scroll on new messages
  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  return (
    <div className="container py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Componentes estilo Cursor / prompt-kit
        </h1>
        <p className="text-muted-foreground">
          Demo de componentes de Chat IA y Timeline/Flujo
        </p>
      </div>

      <Tabs defaultValue="chat" className="space-y-6">
        <TabsList>
          <TabsTrigger value="chat">Chat IA</TabsTrigger>
          <TabsTrigger value="timeline">Timeline / Flujo</TabsTrigger>
          <TabsTrigger value="components">Componentes</TabsTrigger>
        </TabsList>

        {/* TAB: Chat IA */}
        <TabsContent value="chat" className="space-y-0">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base">AI Assistant</CardTitle>
                  <CardDescription>Demo estilo Cursor</CardDescription>
                </div>
              </div>
            </CardHeader>

            {/* Messages Area */}
            <ScrollArea 
              ref={scrollRef}
              className="flex-1 relative"
            >
              <div className="divide-y">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[400px] text-center p-8">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500/20 to-purple-600/20 flex items-center justify-center mb-4">
                      <Sparkles className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">¿En qué puedo ayudarte?</h3>
                    <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                      Puedo ayudarte con código, explicaciones, debugging y más.
                    </p>
                    <PromptSuggestions 
                      suggestions={suggestions}
                      onSelect={handleSendMessage}
                    />
                  </div>
                ) : (
                  <>
                    {messages.map(message => (
                      <MessageBubble key={message.id} message={message} />
                    ))}
                    {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
                      <ThinkingIndicator />
                    )}
                  </>
                )}
              </div>
              <ScrollToBottom 
                onClick={scrollToBottom}
                visible={showScrollButton}
              />
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t bg-muted/30">
              <PromptInput 
                onSend={handleSendMessage}
                disabled={isLoading}
                placeholder="Pregunta algo... (Enter para enviar)"
              />
            </div>
          </Card>
        </TabsContent>

        {/* TAB: Timeline */}
        <TabsContent value="timeline" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Timeline Vertical */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Timeline Vertical</CardTitle>
                <CardDescription>
                  Visualización de pasos del agente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Timeline steps={timelineSteps} />
              </CardContent>
            </Card>

            {/* Steps Horizontal */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Steps Horizontal</CardTitle>
                <CardDescription>
                  Indicador de progreso tipo wizard
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <StepsIndicator steps={stepsLabels} currentStep={currentStep} />
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                  >
                    Previous
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => setCurrentStep(Math.min(stepsLabels.length - 1, currentStep + 1))}
                    disabled={currentStep === stepsLabels.length - 1}
                  >
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chain of Thought */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Chain of Thought</CardTitle>
              <CardDescription>
                Visualización del proceso de razonamiento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { step: 1, thought: 'Analizando el contexto del request...', status: 'done' },
                  { step: 2, thought: 'Identificando archivos relevantes en el codebase...', status: 'done' },
                  { step: 3, thought: 'Generando solución basada en patrones encontrados...', status: 'current' },
                  { step: 4, thought: 'Validando la solución contra tests existentes...', status: 'pending' }
                ].map((item) => (
                  <div 
                    key={item.step}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg",
                      item.status === 'done' && "bg-green-500/5 border border-green-500/20",
                      item.status === 'current' && "bg-blue-500/5 border border-blue-500/20",
                      item.status === 'pending' && "bg-muted/50 border border-border"
                    )}
                  >
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                      item.status === 'done' && "bg-green-500 text-white",
                      item.status === 'current' && "bg-blue-500 text-white",
                      item.status === 'pending' && "bg-muted text-muted-foreground"
                    )}>
                      {item.status === 'done' ? <Check className="h-3 w-3" /> : item.step}
                    </div>
                    <div className="flex-1">
                      <p className={cn(
                        "text-sm",
                        item.status === 'pending' && "text-muted-foreground"
                      )}>
                        {item.thought}
                      </p>
                    </div>
                    {item.status === 'current' && (
                      <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: Componentes */}
        <TabsContent value="components" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Code Block */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">CodeBlock</CardTitle>
                <CardDescription>Bloque de código con copy</CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock 
                  language="typescript"
                  code={`interface User {
  id: string
  name: string
  email: string
}

async function getUser(id: string): Promise<User> {
  const response = await fetch(\`/api/users/\${id}\`)
  return response.json()
}`}
                />
              </CardContent>
            </Card>

            {/* Thinking Indicator */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">ThinkingIndicator</CardTitle>
                <CardDescription>Indicador de procesamiento</CardDescription>
              </CardHeader>
              <CardContent>
                <ThinkingIndicator />
              </CardContent>
            </Card>

            {/* Prompt Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">PromptSuggestions</CardTitle>
                <CardDescription>Sugerencias de prompts</CardDescription>
              </CardHeader>
              <CardContent>
                <PromptSuggestions 
                  suggestions={[
                    'Explain this code',
                    'Add error handling',
                    'Write tests',
                    'Optimize performance',
                    'Add documentation'
                  ]}
                  onSelect={(s) => console.log('Selected:', s)}
                />
              </CardContent>
            </Card>

            {/* Message Bubble */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">MessageBubble</CardTitle>
                <CardDescription>Burbuja de mensaje</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <MessageBubble 
                  message={{
                    id: '1',
                    role: 'user',
                    content: '¿Cómo puedo optimizar este código?',
                    timestamp: new Date()
                  }}
                />
                <MessageBubble 
                  message={{
                    id: '2',
                    role: 'assistant',
                    content: 'Aquí hay algunas sugerencias para optimizar tu código...',
                    timestamp: new Date()
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

