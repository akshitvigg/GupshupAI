"use client"
import axios from "axios"
import { useEffect, useRef, useState } from "react"


export default function Home() {
  const [msgs, setMsgs] = useState<{ role: string, text: string }[]>([])
  const [input, setInput] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)

  const sendMsgs = async () => {

    const res = await axios.post("api/chat", { message: input })
    setMsgs((prev) => [...prev, { role: "user", text: input }, { role: "assistant", text: res.data.text }])
    setInput("")
    console.log(res.data)
  }


  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px"
    }
  }, [input])

  return (
    <div className="flex text-black min-h-screen ">

      <div className={` ${sidebarOpen ? "w-44" : "w-14"} transition-all duration-300 ease-in-out   bg-[#171717] text-white`}>
        <span onClick={() => setSidebarOpen(!sidebarOpen)}>heloo</span>
      </div>

      {/* main chat area */}
      <div className="bg-[#0A0A0A] flex flex-col justify-between w-full">
        <div className=" flex-1 p-4 overflow-y-auto">
          {msgs.map((m, i) => (
            <div key={i} className={`${m.role === "assistant" ? "text-green-400" : "text-white"}`}>
              {m.text}
            </div>
          ))}
        </div>


        <div className=" flex justify-center">
          <div className="p-4 w-[600px] rounded-t-2xl bg-[#171717]">
            <textarea
              ref={textAreaRef}
              className="flex-1 text-white placeholder:text-[#A0A0A0]  w-[550px] outline-none rounded resize-none overflow-y-auto min-h-[40x] max-h-[120px]"
              rows={2}
              value={input}
              onChange={(e) => { setInput(e.target.value) }}
              placeholder="write your query?"
            />
            <div className="text-white  flex justify-between items-center ">
              <span>Gemini 1.5 flash</span>
              <button className="px-3 text-white  py-2.5 bg-white rounded-md" onClick={sendMsgs}><img src={"/up-arrow.png"} width={15} /></button>
            </div>
          </div>
        </div>
      </div>




    </div >

  )
}
