
"use client"

import axios from "axios"
import { useEffect, useRef, useState } from "react"
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
}

export default function Home() {
  const [msgs, setMsgs] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)

  const sendMsgs = async () => {
    const trimmed = input.trim()
    if (!trimmed) return

    const userId = Date.now().toString()
    const assistantId = userId + "-assistant"

    setMsgs(prev => [...prev, { id: userId, role: "user", text: trimmed }])
    setMsgs(prev => [...prev, { id: assistantId, role: "assistant", text: "..." }])
    setInput("")

    try {
      const res = await axios.post("api/chat", { message: trimmed })
      const text = res.data.text ?? "No response"

      setMsgs(prev =>
        prev.map(m => m.id === assistantId ? { ...m, text } : m)
      )
    } catch (err) {
      setMsgs(prev =>
        prev.map(m => m.id === assistantId ? { ...m, text: "Error fetching response" } : m)
      )
    }
  }

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [msgs])

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto"
      textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px"
    }
  }, [input])

  return (
    <div className="flex text-black min-h-screen">
      {/* sidebar */}
      <div className={`${sidebarOpen ? "w-44" : "w-16"} transition-all duration-300 ease-in-out bg-[#171717] border-r border-r-neutral-800 text-white`}>
        <div className="py-4 flex">
          <button
            className="hover:bg-neutral-800 ml-2 rounded-full p-3"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <img width={18} src={"/menu-burger.png"} />
          </button>
        </div>
      </div>

      {/* main chat area */}
      <div className="bg-[#0A0A0A] flex flex-col w-full">
        <div className="text-white px-20 h-14 items-center border-b border-b-neutral-800 flex justify-between">
          <div className="items-center flex text-xl">
            <img src={"/gslogo.png"} className="p-0 h-11 w-auto object-contain" />
            <span className="-translate-x-5">GupShupAI</span>
          </div>
          <div className="px-3 py-1 rounded-full bg-blue-200">P</div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto space-y-16">
          {msgs.map(m => (
            <div key={m.id} className="w-full max-w-4xl mx-auto px-4">
              {m.role === "user" ? (
                <div className="flex justify-end">
                  <div className="inline-block max-w-[70%] bg-[#262626] text-white px-4 py-2 rounded-lg whitespace-pre-wrap break-words">
                    {m.text}
                  </div>
                </div>
              ) : (
                <div className="prose prose-invert max-w-none text-gray-200 leading-relaxed">
                  {m.text === "..." ? (
                    <span className="animate-pulse text-gray-400">Assistant is typing...</span>
                  ) : (
                    <ReactMarkdown
                      components={{
                        code: ({ children, className, ...props }) => {
                          const isInline = !className?.includes('language-')
                          return isInline ? (
                            <code className="bg-[#171717] px-1 py-0.5 rounded text-sm" {...props}>
                              {children}
                            </code>
                          ) : (
                            <pre className="bg-[#171717] p-3 rounded-lg overflow-x-auto">
                              <code className="text-sm" {...props}>
                                {children}
                              </code>
                            </pre>
                          )
                        },
                        h1: ({ children }) => <h1 className="text-2xl font-bold mb-4">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-xl font-bold mb-3">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-lg font-bold mb-2">{children}</h3>,
                        ul: ({ children }) => <ul className="list-disc ml-6 mb-4">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal ml-6 mb-4">{children}</ol>,
                        li: ({ children }) => <li className="mb-1">{children}</li>,
                        p: ({ children }) => <p className="mb-3">{children}</p>,
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
        <div className="sticky bottom-0 flex justify-center">
          <div className="p-4 w-[600px] border-b-0 border border-neutral-800 rounded-t-2xl bg-[#171717]">
            <textarea
              ref={textAreaRef}
              className="flex-1  text-white placeholder:text-[#A0A0A0] w-full outline-none rounded resize-none overflow-y-auto min-h-[40px] max-h-[120px] p-2"
              rows={2}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Write your query..."
            />
            <div className="text-white flex justify-between items-center mt-2">
              <span className="text-neutral-400">Gemini 1.5 flash</span>
              <button
                className={`px-3 py-3 rounded-full transition-all duration-200 active:scale-95 ${!input.trim() ? "bg-neutral-600 cursor-not-allowed" : "bg-white"
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
