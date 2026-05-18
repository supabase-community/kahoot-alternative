import {
  Participant,
  Choice,
  Question,
  QuizSet,
  Answer,
  Game,
  GameResult,
} from './types';

// Mock data that matches the expected database schema
const mockParticipant: Participant = {
  created_at: '2023-01-01T00:00:00Z',
  game_id: 'game-id',
  id: 'participant-id',
  nickname: 'Test User',
  user_id: 'user-id',
};

const mockChoice: Choice = {
  body: 'Test choice',
  created_at: '2023-01-01T00:00:00Z',
  id: 'choice-id',
  is_correct: true,
  question_id: 'question-id',
};

const mockQuestion: Question = {
  body: 'Test question',
  created_at: '2023-01-01T00:00:00Z',
  id: 'question-id',
  image_url: null,
  order: 1,
  quiz_set_id: 'quiz-set-id',
  choices: [mockChoice],
};

const mockQuizSet: QuizSet = {
  created_at: '2023-01-01T00:00:00Z',
  description: 'Test quiz set',
  id: 'quiz-set-id',
  name: 'Test Quiz',
  questions: [mockQuestion],
};

const mockAnswer: Answer = {
  choice_id: 'choice-id',
  created_at: '2023-01-01T00:00:00Z',
  id: 'answer-id',
  participant_id: 'participant-id',
  question_id: 'question-id',
  score: 10,
};

const mockGame: Game = {
  created_at: '2023-01-01T00:00:00Z',
  current_question_sequence: 1,
  host_user_id: 'host-user-id',
  id: 'game-id',
  is_answer_revealed: false,
  phase: 'lobby',
  quiz_set_id: 'quiz-set-id',
};

const mockGameResult: GameResult = {
  game_id: 'game-id',
  nickname: 'Test User',
  participant_id: 'participant-id',
  total_score: 100,
};

describe('Type Definitions', () => {
  test('Participant type should have correct properties', () => {
    expect(mockParticipant).toHaveProperty('created_at');
    expect(mockParticipant).toHaveProperty('game_id');
    expect(mockParticipant).toHaveProperty('id');
    expect(mockParticipant).toHaveProperty('nickname');
    expect(mockParticipant).toHaveProperty('user_id');
    
    expect(typeof mockParticipant.created_at).toBe('string');
    expect(typeof mockParticipant.game_id).toBe('string');
    expect(typeof mockParticipant.id).toBe('string');
    expect(typeof mockParticipant.nickname).toBe('string');
    expect(typeof mockParticipant.user_id).toBe('string');
  });

  test('Choice type should have correct properties', () => {
    expect(mockChoice).toHaveProperty('body');
    expect(mockChoice).toHaveProperty('created_at');
    expect(mockChoice).toHaveProperty('id');
    expect(mockChoice).toHaveProperty('is_correct');
    expect(mockChoice).toHaveProperty('question_id');
    
    expect(typeof mockChoice.body).toBe('string');
    expect(typeof mockChoice.created_at).toBe('string');
    expect(typeof mockChoice.id).toBe('string');
    expect(typeof mockChoice.is_correct).toBe('boolean');
    expect(typeof mockChoice.question_id).toBe('string');
  });

  test('Question type should have correct properties', () => {
    expect(mockQuestion).toHaveProperty('body');
    expect(mockQuestion).toHaveProperty('created_at');
    expect(mockQuestion).toHaveProperty('id');
    expect(mockQuestion).toHaveProperty('image_url');
    expect(mockQuestion).toHaveProperty('order');
    expect(mockQuestion).toHaveProperty('quiz_set_id');
    expect(mockQuestion).toHaveProperty('choices');
    
    expect(typeof mockQuestion.body).toBe('string');
    expect(typeof mockQuestion.created_at).toBe('string');
    expect(typeof mockQuestion.id).toBe('string');
    expect(mockQuestion.image_url === null || typeof mockQuestion.image_url === 'string').toBe(true);
    expect(typeof mockQuestion.order).toBe('number');
    expect(typeof mockQuestion.quiz_set_id).toBe('string');
    expect(Array.isArray(mockQuestion.choices)).toBe(true);
  });

  test('QuizSet type should have correct properties', () => {
    expect(mockQuizSet).toHaveProperty('created_at');
    expect(mockQuizSet).toHaveProperty('description');
    expect(mockQuizSet).toHaveProperty('id');
    expect(mockQuizSet).toHaveProperty('name');
    expect(mockQuizSet).toHaveProperty('questions');
    
    expect(typeof mockQuizSet.created_at).toBe('string');
    expect(mockQuizSet.description === null || typeof mockQuizSet.description === 'string').toBe(true);
    expect(typeof mockQuizSet.id).toBe('string');
    expect(typeof mockQuizSet.name).toBe('string');
    expect(Array.isArray(mockQuizSet.questions)).toBe(true);
  });

  test('Answer type should have correct properties', () => {
    expect(mockAnswer).toHaveProperty('choice_id');
    expect(mockAnswer).toHaveProperty('created_at');
    expect(mockAnswer).toHaveProperty('id');
    expect(mockAnswer).toHaveProperty('participant_id');
    expect(mockAnswer).toHaveProperty('question_id');
    expect(mockAnswer).toHaveProperty('score');
    
    expect(mockAnswer.choice_id === null || typeof mockAnswer.choice_id === 'string').toBe(true);
    expect(typeof mockAnswer.created_at).toBe('string');
    expect(typeof mockAnswer.id).toBe('string');
    expect(typeof mockAnswer.participant_id).toBe('string');
    expect(typeof mockAnswer.question_id).toBe('string');
    expect(typeof mockAnswer.score).toBe('number');
  });

  test('Game type should have correct properties', () => {
    expect(mockGame).toHaveProperty('created_at');
    expect(mockGame).toHaveProperty('current_question_sequence');
    expect(mockGame).toHaveProperty('host_user_id');
    expect(mockGame).toHaveProperty('id');
    expect(mockGame).toHaveProperty('is_answer_revealed');
    expect(mockGame).toHaveProperty('phase');
    expect(mockGame).toHaveProperty('quiz_set_id');
    
    expect(typeof mockGame.created_at).toBe('string');
    expect(typeof mockGame.current_question_sequence).toBe('number');
    expect(mockGame.host_user_id === null || typeof mockGame.host_user_id === 'string').toBe(true);
    expect(typeof mockGame.id).toBe('string');
    expect(typeof mockGame.is_answer_revealed).toBe('boolean');
    expect(typeof mockGame.phase).toBe('string');
    expect(typeof mockGame.quiz_set_id).toBe('string');
  });

  test('GameResult type should have correct properties', () => {
    expect(mockGameResult).toHaveProperty('game_id');
    expect(mockGameResult).toHaveProperty('nickname');
    expect(mockGameResult).toHaveProperty('participant_id');
    expect(mockGameResult).toHaveProperty('total_score');
    
    expect(mockGameResult.game_id === null || typeof mockGameResult.game_id === 'string').toBe(true);
    expect(mockGameResult.nickname === null || typeof mockGameResult.nickname === 'string').toBe(true);
    expect(mockGameResult.participant_id === null || typeof mockGameResult.participant_id === 'string').toBe(true);
    expect(mockGameResult.total_score === null || typeof mockGameResult.total_score === 'number').toBe(true);
  });

  test('Question should include choices array', () => {
    const questionWithChoices: Question = {
      ...mockQuestion,
      choices: [mockChoice],
    };
    
    expect(questionWithChoices.choices).toBeInstanceOf(Array);
    expect(questionWithChoices.choices.length).toBe(1);
    expect(questionWithChoices.choices[0]).toEqual(mockChoice);
  });

  test('QuizSet should include questions array', () => {
    const quizSetWithQuestions: QuizSet = {
      ...mockQuizSet,
      questions: [mockQuestion],
    };
    
    expect(quizSetWithQuestions.questions).toBeInstanceOf(Array);
    expect(quizSetWithQuestions.questions.length).toBe(1);
    expect(quizSetWithQuestions.questions[0]).toEqual(mockQuestion);
  });
});