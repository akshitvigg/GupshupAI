

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
    <div className="flex flex-col items-center justify-center px-4 md:px-8 py-8 md:py-16 text-white min-h-[60vh]">
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
          How can I help you?
        </h1>
      </div>

      <div className="w-full max-w-2xl space-y-3 md:space-y-4">
        {prompts.map((prompt, i) => (
          <div
            key={i}
            onClick={() => onPromptClick(prompt)}
            className="w-full py-3 md:py-4 px-4 md:px-6 
                     border border-neutral-800 hover:border-neutral-600
                     bg-transparent hover:bg-[#262626] 
                     rounded-xl cursor-pointer 
                     text-neutral-300 hover:text-white
                     transition-all duration-200 
                     hover:scale-[1.02] active:scale-[0.98]
                     text-sm md:text-base"
          >
            <div className="flex items-center justify-between">
              <span>{prompt}</span>
              <svg
                className="w-4 h-4 md:w-5 md:h-5 text-neutral-500 group-hover:text-neutral-300 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>

      <p className="text-neutral-500 text-xs md:text-sm mt-6 md:mt-8 text-center max-w-md">
        Click on any prompt to get started, or type your own question below
      </p>
    </div>
  )
}
