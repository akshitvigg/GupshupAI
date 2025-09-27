"use client"

import axios from "axios"
import { useEffect, useRef, useState } from "react"
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import GreetingsPrompt from "./components/greetings"
import { IconPlus, IconTrash } from "@tabler/icons-react"

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
}

type ChatSession = {
  id: string;
  title: string;
  createdAt: number;
  messages: Message[]
}

export default function Home() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [input, setInput] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
  const [showGreetings, setShowGreetings] = useState(true)

  const activeSession = sessions.find(s => s.id === activeSessionId)
  const msgs = activeSession?.messages ?? []

  const handleMessage = async (message: string) => {
    if (showGreetings) setShowGreetings(false)

    const trimmed = message.trim()
    if (!trimmed) return

    let currentSessionId = activeSessionId
    if (!currentSessionId) {
      const id = Date.now().toString()
      const newSession: ChatSession = {
        id,
        title: trimmed.slice(0, 20),
        createdAt: Date.now(),
        messages: []
      }
      setSessions(prev => [newSession, ...prev])
      setActiveSessionId(id)
      currentSessionId = id
    }

    const userId = Date.now().toString()
    const assistantId = userId + "-assistant"

    const currentSession = sessions.find(s => s.id === currentSessionId)
    const conversationHistory = currentSession?.messages || []

    setSessions(prev =>
      prev.map(s =>
        s.id === currentSessionId
          ? {
            ...s,
            title: s.messages.length === 0 ? trimmed.slice(0, 20) : s.title,
            messages: [
              ...s.messages,
              { id: userId, role: "user", text: trimmed },
              { id: assistantId, role: "assistant", text: "..." }
            ]
          }
          : s
      )
    )

    try {
      const res = await axios.post("api/chat", {
        message: trimmed,
        conversationHistory: conversationHistory
      })
      const text = res.data.text ?? "No response"

      setSessions(prev =>
        prev.map(s =>
          s.id === currentSessionId
            ? {
              ...s,
              messages: s.messages.map(m =>
                m.id === assistantId ? { ...m, text } : m
              )
            }
            : s
        )
      )
    } catch {
      setSessions(prev =>
        prev.map(s =>
          s.id === currentSessionId
            ? {
              ...s,
              messages: s.messages.map(m =>
                m.id === assistantId ? { ...m, text: "Error fetching response" } : m
              )
            }
            : s
        )
      )
    }
  }

  const sendMsgs = () => {
    if (!input.trim()) return
    handleMessage(input)
    setInput("")
  }

  const handleKeypress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMsgs()
    }
  }

  const createNewSession = () => {
    const id = Date.now().toString()
    const newSession: ChatSession = {
      id,
      title: "New Chat",
      createdAt: Date.now(),
      messages: []
    }
    setSessions(prev => [newSession, ...prev])
    setActiveSessionId(id)
    setShowGreetings(true)
  }

  useEffect(() => {
    if (activeSession) {
      setShowGreetings(activeSession.messages.length === 0)
    }
  }, [activeSession])

  useEffect(() => {
    const saved = localStorage.getItem("chatSessions")
    if (saved) {
      const parsed: ChatSession[] = JSON.parse(saved)
      if (parsed.length > 0) {
        setSessions(parsed)
        const firstSession = parsed[0]
        setActiveSessionId(firstSession.id)
        setShowGreetings(firstSession.messages.length === 0)
      } else {
        setShowGreetings(true)
      }
    } else {
      setShowGreetings(true)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("chatSessions", JSON.stringify(sessions))
  }, [sessions])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [msgs])

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto"
      textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px"
    }
  }, [input])

  const clearChat = () => {
    localStorage.removeItem("chatSessions")
    setSessions([])
    setActiveSessionId(null)
    setShowGreetings(true)
  }

  return (
    <div className="flex text-black h-screen">
      {/* mobile overlay for sidebar */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* sidebar */}
      <div className={`
      ${sidebarOpen ? "w-64" : "w-0 md:w-16"} 
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      fixed md:relative h-full z-30 md:z-auto
      transition-all duration-300 ease-in-out 
      bg-[#0F0F0F] border-r border-r-neutral-700/50 text-white flex flex-col
    `}>
        <div className="py-4 flex">
          <button
            className="hover:bg-neutral-800/60 ml-2 rounded-full cursor-pointer p-3 transition-colors duration-200"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <img width={18} src={"/menu-burger.png"} />
          </button>
        </div>

        {sidebarOpen ? (
          <>
            <div className="flex-1 px-3 space-y-2 overflow-y-auto pb-4">
              <button
                onClick={createNewSession}
                className="w-full bg-white py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer hover:bg-zinc-200 active:scale-95 shadow-lg"
              >
                <span className="flex text-black items-center justify-center gap-2">
                  <IconPlus strokeWidth={2.5} size={19} />
                  New Chat
                </span>
              </button>

              <div className="space-y-1 pt-2">
                {sessions.map(s => (
                  <div
                    key={s.id}
                    onClick={() => {
                      setActiveSessionId(s.id)
                      // autoclose sidebar on mobile when selecting a chat
                      if (window.innerWidth < 768) setSidebarOpen(false)
                    }}
                    className={`group cursor-pointer px-3 py-3 rounded-xl text-sm transition-all duration-200 hover:scale-[1.01] ${activeSessionId === s.id
                      ? "bg-gradient-to-r from-neutral-700 to-neutral-600 shadow-md border border-neutral-600/50"
                      : "hover:bg-neutral-800/60 hover:shadow-sm"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors duration-200 ${activeSessionId === s.id ? "bg-white" : "bg-neutral-600 group-hover:bg-neutral-400"
                        }`} />
                      <span className="truncate font-normal">{s.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 border-t border-neutral-700/50">
              <button
                onClick={clearChat}
                className="w-full bg-[#B22222] hover:bg-[#B33333] cursor-pointer py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-lg backdrop-blur-sm"
              >
                <span className="flex items-center justify-center gap-2">
                  <IconTrash size={18} />
                  Clear Chats
                </span>
              </button>
            </div>
          </>
        ) : ""}
      </div>

      {/* main chat area */}
      <div className="bg-[#0A0A0A] overflow-y-auto flex flex-col w-full">
        <div className="text-white px-4 md:px-20 h-14 items-center border-b border-b-neutral-800 flex justify-between">
          <div className="items-center flex text-lg md:text-xl">
            <button
              className="md:hidden hover:bg-neutral-800/60 mr-3 rounded-full cursor-pointer p-2 transition-colors duration-200"
              onClick={() => setSidebarOpen(true)}
            >
              <img width={18} src={"/menu-burger.png"} />
            </button>

            <div
              className="flex items-center cursor-pointer hidden md:flex"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <img src={"/gslogo.png"} className="h-8 md:h-11 w-auto object-contain" />
              <span className="ml-2 -translate-x-5 sm:-translate-x-7">GupShupAI</span>
            </div>

            <div className="flex items-center md:hidden">
              <img src={"/gslogo.png"} className="h-8 md:h-11 w-auto object-contain" />
              <span className="ml-2 -translate-x-5 sm:-translate-x-7">GupShupAI</span>
            </div>
          </div>
          <div className="px-2 md:px-3 py-1 rounded-full bg-[#9B1FE8] text-sm md:text-base">A</div>
        </div>

        {showGreetings && <GreetingsPrompt onPromptClick={handleMessage} />}

        <div className="flex-1 p-3 md:p-6 overflow-y-auto space-y-8 md:space-y-16">
          {msgs.map(m => (
            <div key={m.id} className="w-full max-w-4xl mx-auto px-2 md:px-4">
              {m.role === "user" ? (
                <div className="flex justify-end">
                  <div className="inline-block max-w-[85%] md:max-w-[70%] bg-[#262626] text-white px-3 md:px-4 py-2 rounded-lg whitespace-pre-wrap break-words text-sm md:text-base">
                    {m.text}
                  </div>
                </div>
              ) : (
                <div className="prose prose-invert max-w-none text-gray-200 leading-relaxed text-sm md:text-base">
                  {m.text === "..." ? (
                    <span className="animate-pulse text-gray-400">Assistant is typing...</span>
                  ) : (
                    <ReactMarkdown
                      components={{
                        code: ({ children, className, ...props }) => {
                          const isInline = !className?.includes('language-')
                          return isInline ? (
                            <code className="bg-[#171717] px-1 py-0.5 rounded text-xs md:text-sm" {...props}>
                              {children}
                            </code>
                          ) : (
                            <pre className="bg-[#171717] p-2 md:p-3 rounded-lg overflow-x-auto">
                              <code className="text-xs md:text-sm" {...props}>
                                {children}
                              </code>
                            </pre>
                          )
                        },
                        h1: ({ children }) => <h1 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-lg md:text-xl font-bold mb-2 md:mb-3">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-base md:text-lg font-bold mb-2">{children}</h3>,
                        ul: ({ children }) => <ul className="list-disc ml-4 md:ml-6 mb-3 md:mb-4">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal ml-4 md:ml-6 mb-3 md:mb-4">{children}</ol>,
                        li: ({ children }) => <li className="mb-1">{children}</li>,
                        p: ({ children }) => <p className="mb-2 md:mb-3">{children}</p>,
                      } as Components}
                    >
                      {m.text}
                    </ReactMarkdown>
                  )}
                </div>
              )}
            </div>
          ))}
          <div ref={scrollRef}></div>
        </div>

        {/* prompt area */}
        <div className="sticky bottom-0 flex justify-center px-4 md:px-0">
          <div className="p-3 md:p-4 w-full max-w-[600px] border-b-0 border border-neutral-800 rounded-t-2xl bg-[#171717]">
            <textarea
              ref={textAreaRef}
              className="flex-1 text-white placeholder:text-[#A0A0A0] w-full outline-none rounded resize-none overflow-y-auto min-h-[40px] max-h-[120px] p-2 text-sm md:text-base"
              rows={2}
              onKeyPress={handleKeypress}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Write your query..."
            />
            <div className="text-white flex justify-between items-center mt-2">
              <span className="text-neutral-400 text-xs md:text-sm">Gemini 2.5 flash</span>
              <p className="text-xs text-neutral-500  -translate-x-5 translate-y-6">
                Built out of boredom by{" "}
                <a href="https://akshitt.me">
                  <span className="text-neutral-400 hover:text-white hover:cursor-pointer underline">Akshit</span>
                </a>
              </p>
              <button
                className={`px-3 py-3 rounded-full transition-all duration-200 active:scale-95 ${!input.trim() ? "bg-neutral-600 cursor-not-allowed" : "bg-white cursor-pointer"
                  }`}
                onClick={sendMsgs}
                title={`${!input.trim() ? "Message requires text" : ""}`}
              >
                <img src={"/up-arrow.png"} width={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
