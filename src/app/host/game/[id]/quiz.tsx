import { TIME_TIL_CHOICE_REVEAL } from '@/constants'
import { Answer, Participant, Question, supabase } from '@/types/types'
import { useEffect, useRef, useState } from 'react'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'

export default function Quiz({
  question: question,
  questionCount: questionCount,
  gameId,
  participants,
}: {
  question: Question
  questionCount: number
  gameId: string
  participants: Participant[]
}) {
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false)

  const [hasShownChoices, setHasShownChoices] = useState(false)

  const [answers, setAnswers] = useState<Answer[]>([])

  const answerStateRef = useRef<Answer[]>()

  answerStateRef.current = answers

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

  const onTimeUp = async () => {
    setIsAnswerRevealed(true)
    await supabase
      .from('games')
      .update({
        is_answer_revealed: true,
      })
      .eq('id', gameId)
  }

  useEffect(() => {
    setIsAnswerRevealed(false)
    setHasShownChoices(false)
    setAnswers([])

    setTimeout(() => {
      setHasShownChoices(true)
    }, TIME_TIL_CHOICE_REVEAL)

    const channel = supabase
      .channel('answers')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'answers',
          filter: `question_id=eq.${question.id}`,
        },
        (payload) => {
          setAnswers((currentAnswers) => {
            return [...currentAnswers, payload.new as Answer]
          })

          if (
            (answerStateRef.current?.length ?? 0) + 1 ===
            participants.length
          ) {
            onTimeUp()
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [question.id])

  return (
    <div className="h-screen flex flex-col items-stretch bg-slate-900 relative">
      <div className="absolute right-4 top-4">
        {isAnswerRevealed && (
          <button
            className="p-2 bg-white text-black rounded hover:bg-gray-200"
            onClick={getNextQuestion}
          >
            Next
          </button>
        )}
      </div>

      <div className="text-center">
        <h2 className="pb-4 text-3xl bg-white font-bold mx-24 my-12 p-4 rounded inline-block">
          {question.body}
        </h2>
      </div>

      <div className="flex-grow text-white px-8">
        {hasShownChoices && !isAnswerRevealed && (
          <div className="flex justify-between items-center">
            <div className="text-5xl">
              <CountdownCircleTimer
                onComplete={() => {
                  onTimeUp()
                }}
                isPlaying
                duration={20}
                colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                colorsTime={[7, 5, 2, 0]}
              >
                {({ remainingTime }) => remainingTime}
              </CountdownCircleTimer>
            </div>
            <div className="text-center">
              <div className="text-6xl pb-4">{answers.length}</div>
              <div className="text-3xl">Answers</div>
            </div>
          </div>
        )}
        {isAnswerRevealed && (
          <div className="flex justify-center">
            {question.choices.map((choice, index) => (
              <div
                key={choice.id}
                className="mx-2 h-48 w-24 flex flex-col items-stretch justify-end"
              >
                <div className="flex-grow relative">
                  <div
                    style={{
                      height: `${
                        (answers.filter(
                          (answer) => answer.choice_id === choice.id
                        ).length *
                          100) /
                        (answers.length || 1)
                      }%`,
                    }}
                    className={`absolute bottom-0 left-0 right-0 mb-1 rounded-t ${
                      index === 0
                        ? 'bg-red-500'
                        : index === 1
                        ? 'bg-blue-500'
                        : index === 2
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                  ></div>
                </div>
                <div
                  className={`mt-1 text-white text-lg text-center py-2 rounded-b ${
                    index === 0
                      ? 'bg-red-500'
                      : index === 1
                      ? 'bg-blue-500'
                      : index === 2
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                >
                  {
                    answers.filter((answer) => answer.choice_id === choice.id)
                      .length
                  }
                </div>
              </div>
            ))}
          </div>
        )}
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

      <div className="flex text-white py-2 px-4 items-center bg-black">
        <div className="text-2xl">
          {question.order + 1}/{questionCount}
        </div>
      </div>
    </div>
  )
}
