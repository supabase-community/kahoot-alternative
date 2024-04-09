'use client'

import { QuizSet, supabase } from '@/types/types'
import { useEffect, useState } from 'react'

export default function Home() {
  const [questionSets, setQuestionSets] = useState<QuizSet[]>([])

  useEffect(() => {
    const getQuizSets = async () => {
      const { data, error } = await supabase
        .from('quiz_sets')
        .select(`*, questions(*, choices(*))`)
      if (error) {
        alert('Failed to fetch quiz sets')
        return
      }
      setQuestionSets(data)
    }
    getQuizSets()
  }, [])

  const startGame = () => {
    console.log('start game clicked')
  }

  return (
    <>
      {questionSets.map((questionSet) => (
        <div
          key={questionSet.id}
          className="flex justify-start shadow m-2 rounded"
        >
          <img
            className="h-28"
            src="https://assets-cdn.kahoot.it/builder/v2/assets/placeholder-cover-kahoot-dca23b0a.png"
            alt=""
          />
          <div className="p-2 flex flex-col justify-between items-stretch flex-grow">
            <h2 className="font-bold">{questionSet.name}</h2>
            <div className="flex justify-between items-end">
              <div>{questionSet.questions.length} questions</div>
              <div>
                <button
                  className="bg-green-500 text-white py-1 px-4 rounded"
                  onClick={startGame}
                >
                  Start Game
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}
