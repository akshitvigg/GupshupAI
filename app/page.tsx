"use client"
import axios from "axios"
import { useEffect, useRef, useState } from "react"


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

        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {msgs.map((m, i) => (
            <div key={i} className="w-full">
              {m.role === "user" ? (
                <div className="ml-auto max-w-[70%] bg-[#2D2D2D] text-white px-4 py-2 rounded-lg whitespace-pre-wrap break-words">
                  {m.text}
                </div>
              ) : (
                <div className="prose prose-invert max-w-none text-gray-200 mx-auto leading-relaxed whitespace-pre-wrap">
                  {m.text === "..."
                    ? <span className="animate-pulse text-gray-400">Assistant is typing...</span>
                    : m.text}
                </div>
              )}
            </div>
          ))}
        </div>
        {/* promt area */}
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
