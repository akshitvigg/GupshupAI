"use client"
import axios from "axios"
import { useRef, useState } from "react"


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
          <div className="flex p-4 w-[600px] items-end bg-violet-950">
            <textarea />
            <button className="px-4 text-white py-2 bg-black rounded" onClick={sendMsgs}>send</button>
          </div>
        </div>
      </div>




    </div >

  )
}
