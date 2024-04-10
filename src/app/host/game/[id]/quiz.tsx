import { Question, supabase } from '@/types/types'
import { useEffect, useState } from 'react'

export default function Quiz({
  question: question,
  questionCount: questionCount,
  gameId,
}: {
  question: Question
  questionCount: number
  gameId: string
}) {
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false)

  const [hasShownChoices, setHasShownChoices] = useState(false)

  const getNextQuestion = async () => {
    var updateData
    if (questionCount == question.order + 1) {
      updateData = { phase: 'result' }
    } else {
      updateData = {
        current_question_sequence: question.order + 1,
        is_answer_revealed: false,
      }
    }

    const { data, error } = await supabase
      .from('games')
      .update(updateData)
      .eq('id', gameId)
    if (error) {
      return alert(error.message)
    }
  }

  useEffect(() => {
    setHasShownChoices(false)

    setTimeout(() => {
      setHasShownChoices(true)
    }, 5)
  }, [question.id])

  return (
    <div className="h-screen flex flex-col items-stretch bg-slate-900 relative">
      <div className="absolute right-4 top-4">
        {!isAnswerRevealed && (
          <button
            className="p-2 bg-white text-black rounded hover:bg-gray-200"
            onClick={async () => {
              setIsAnswerRevealed(true)
              await supabase
                .from('games')
                .update({ is_answer_revealed: true })
                .eq('id', gameId)
            }}
          >
            View Answer
          </button>
        )}
        {isAnswerRevealed && (
          <button
            className="p-2 bg-white text-black rounded hover:bg-gray-200"
            onClick={getNextQuestion}
          >
            Go to Next Question
          </button>
        )}
      </div>

      <div className="text-center flex-grow">
        <h2 className="pb-4 text-3xl bg-white font-bold mx-24 my-12 p-4 rounded inline-block">
          {question.body}
        </h2>
      </div>

      {hasShownChoices && (
        <div className="flex justify-between flex-wrap p-4">
          {question.choices.map((choice, index) => (
            <div key={choice.id} className="w-1/2 p-1">
              <div
                className={`px-4 py-6 w-full text-2xl rounded font-bold text-white flex justify-between
                ${
                  index === 0
                    ? 'bg-red-500'
                    : index === 1
                    ? 'bg-blue-500'
                    : index === 2
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }
                ${isAnswerRevealed && !choice.is_correct ? 'opacity-60' : ''}
               `}
              >
                <div>{choice.body}</div>
                {isAnswerRevealed && (
                  <div>
                    {choice.is_correct && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m4.5 12.75 6 6 9-13.5"
                        />
                      </svg>
                    )}
                    {!choice.is_correct && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18 18 6M6 6l12 12"
                        />
                      </svg>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {!hasShownChoices && (
        <div className="text-center">
          <div role="status">
            <svg
              aria-hidden="true"
              className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-green-500"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}

      <div className="flex text-white py-2 px-4 items-center bg-black">
        <div className="text-2xl">
          {question.order + 1}/{questionCount}
        </div>
      </div>
    </div>
  )
}
