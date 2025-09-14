"use client"
import axios from "axios"
import { useState } from "react"
import { text } from "stream/consumers"


export default function Home() {
  const [msgs, setMsgs] = useState<{ role: string, text: string }[]>([])
  const [input, setInput] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const sendMsgs = async () => {

    const res = await axios.post("api/chat", { message: input })
    setMsgs((prev) => [...prev, { role: "user", text: input }, { role: "assistant", text: res.data.text }])
    setInput("")
    console.log(res.data)
  }

  return (
    <div className="flex text-black min-h-screen ">

      <div className={` ${sidebarOpen ? "w-44" : "w-14"} transition-all duration-300 ease-in-out   bg-black  text-white`}>
        <span onClick={() => setSidebarOpen(!sidebarOpen)}>heloo</span>
      </div>

      {/* main chat area */}
      <div className="bg-neutral-700 flex-row justify-between w-full">
        <div className=" flex-1 p-4 overflow-y-auto">
          {msgs.map((m, i) => (
            <div key={i} className={`${m.role === "assistant" ? "text-green-400" : "text-white"}`}>
              {m.text}
            </div>
          ))}
        </div>



        <div className="flex p-4 bg-violet-950">
          <input className="flex-1 p-2 mr-2 rounded"
            value={input}
            onChange={(e) => { setInput(e.target.value) }}
            placeholder="write your prompt"
          />
          <button className="px-4 text-white py-2 bg-black rounded" onClick={sendMsgs}>send</button>
        </div>
      </div>




    </div>

  )
}
