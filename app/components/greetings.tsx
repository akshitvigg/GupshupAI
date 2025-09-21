

interface GreetingsPromptProps {
  onPromptClick: (message: string) => void
}

export default function GreetingsPrompt({ onPromptClick }: GreetingsPromptProps) {

  const prompts = [
    "How does AI Work?",
    "Are black holes real?",
    "How many Rs in the word 'strawberry'?",
    "What is the meaning of life?"
  ]

  return (
    <div className=" pl-[340px] text-white">
      <div className="text-3xl pt-28 font-bold">How can I help you?</div>
      <div className=" pt-10">
        {prompts.map((prompt, i) => (
          <div onClick={() => onPromptClick(prompt)} className="py-3 w-[550px] border-b hover:bg-[#262626] rounded-lg pl-3 text-neutral-300 cursor-pointer border-neutral-800" key={i}>
            {prompt}
          </div>
        ))}
      </div>
    </div>

  )
}
