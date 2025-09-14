"use client"
import axios from "axios"
import { useState } from "react"


export default function Home() {
  const [msgs, setMsgs] = useState([])
  const [input, setInput] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const sendMsgs = async () => {

    const res = await axios.post("api/chat", { message: input })

    setMsgs(res.data.text)

    console.log(res.data)
  }

  return (
    <div className="flex text-black min-h-screen ">

      <div className={` ${sidebarOpen ? "w-44" : "w-14"} transition-all duration-300 ease-in-out   bg-black  text-white`}> <span onClick={() => setSidebarOpen(!sidebarOpen)}>heloo</span></div>

      <div className="bg-neutral-700 flex-row justify-between w-full">
        <div>
          {msgs}
        </div>

        <div className=" bg-violet-950 flex justify-center ">
          <input className=" bg-white" onChange={(e) => { setInput(e.target.value) }} placeholder="write your prompt" />
          <button className=" bg-violet-950" onClick={sendMsgs}>send</button>
        </div>
      </div>




    </div>

  )
}
