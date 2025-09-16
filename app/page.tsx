"use client"
import axios from "axios"
import { useEffect, useRef, useState } from "react"
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'

export default function Home() {
  const [msgs, setMsgs] = useState<{ role: string, text: string }[]>([])
  const [input, setInput] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)

  const sendMsgs = async () => {
    if (!input.trim()) return;
    setMsgs((prev) => [...prev, { role: "user", text: input }])
    //for loading msg; 
    const tempIndex = msgs.length + 1;
    setMsgs((prev) => [...prev, { role: "assistant", text: "..." }])
    const currentInput = input
    setInput("")
    try {
      const res = await axios.post("api/chat", { message: currentInput })
      setMsgs((prev) =>
        prev.map((m, i) => (
          i === tempIndex ? { role: "assistant", text: res.data.text } : m
        ))
      )
      console.log(res.data)
      console.log(msgs);
    } catch (err) {
      setMsgs((prev) =>
        prev.map((m, i) => (
          i === tempIndex ? { role: "assistant", text: "Error fetching response" } : m
        ))
      )
    }
  }

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px"
    }
  }, [input])

  return (
    <div className="flex text-black min-h-screen">
      {/* sidebar */}
      <div className={`${sidebarOpen ? "w-44" : "w-16"} transition-all duration-300 ease-in-out bg-[#171717] text-white`}>
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
        <div className="flex-1 p-6 overflow-y-auto space-y-16">
          {msgs.map((m, i) => (
            <div key={i} className="w-full max-w-4xl mx-auto px-4">
              {m.role === "user" ? (
                <div className="flex justify-end">
                  <div className="inline-block max-w-[70%] bg-[#2D2D2D] text-white px-4 py-2 rounded-lg whitespace-pre-wrap break-words">
                    {m.text}
                  </div>
                </div>
              ) : (
                <div className="prose prose-invert max-w-none text-gray-200 leading-relaxed">
                  {m.text === "..." ? (
                    <span className="animate-pulse text-gray-400">Assistant is typing...</span>
                  ) : (
                    <div className="markdown-content">
                      <ReactMarkdown
                        components={{

                          code: ({ children, className, ...props }) => {
                            const isInline = !className?.includes('language-')
                            return isInline ? (
                              <code className="bg-[#171717]  px-1 py-0.5 rounded text-sm" {...props}>
                                {children}
                              </code>
                            ) : (
                              <pre className="bg-[#171717]  p-3 rounded-lg overflow-x-auto">
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
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* prompt area */}
        <div className="sticky bottom-0 flex justify-center">
          <div className="p-4 w-[600px] rounded-t-2xl bg-[#171717]">
            <textarea
              ref={textAreaRef}
              className="flex-1 text-white placeholder:text-[#A0A0A0] w-full outline-none rounded resize-none overflow-y-auto min-h-[40px] max-h-[120px] p-2 bg-[#0A0A0A]"
              rows={2}
              value={input}
              onChange={(e) => { setInput(e.target.value) }}
              placeholder="Write your query..."
            />
            <div className="text-white flex justify-between items-center">
              <span>Gemini 1.5 flash</span>
              <button
                className="px-3 py-2.5 bg-white rounded-md"
                onClick={sendMsgs}
              >
                <img src={"/up-arrow.png"} width={15} />
              </button >
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}
