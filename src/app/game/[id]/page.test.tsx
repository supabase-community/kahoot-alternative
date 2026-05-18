import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from './page';

// Mock the child component types
type LobbyProps = { onRegisterCompleted: () => void, gameId: string };
type QuizProps = any;

// Basic mocks for the external dependencies
jest.mock('@/types/types', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({ data: null, error: null }),
      single: jest.fn().mockResolvedValue({ 
        data: { id: 'game-1', phase: 'lobby', current_question_sequence: 0, is_answer_revealed: false, quiz_set_id: 'quiz-set-1' }, 
        error: null 
      })
    })),
    channel: jest.fn().mockReturnValue({
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn().mockReturnThis()
    }),
    removeChannel: jest.fn(),
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: null }, error: null }),
      signInAnonymously: jest.fn().mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null })
    }
  },
  Participant: jest.fn(),
  Choice: jest.fn(),
  Question: jest.fn(),
  QuizSet: jest.fn(),
  Answer: jest.fn(),
  Game: jest.fn(),
  GameResult: jest.fn(),
}));

// Mock the child components
jest.mock('./lobby', () => ({
  __esModule: true,
  default: ({ onRegisterCompleted, gameId }: LobbyProps) => (
    <div data-testid="lobby-component">Lobby Component - {gameId}</div>
  )
}));

jest.mock('./quiz', () => ({
  __esModule: true,
  default: ({ question, questionCount, participantId, isAnswerRevealed }: QuizProps) => (
    <div data-testid="quiz-component">Quiz Component</div>
  )
}));

describe('Game Page Component', () => {
  it('renders initial state with lobby component', () => {
    const params = { id: 'game-1' };

    render(<Home params={params} />);

    // Should render with the lobby component immediately
    expect(screen.getByTestId('lobby-component')).toBeInTheDocument();
    expect(screen.getByText(/game-1/)).toBeInTheDocument();
  });

  it('passes correct props to lobby component', () => {
    const params = { id: 'test-game-id' };

    render(<Home params={params} />);

    // The lobby component should receive the correct game ID
    expect(screen.getByTestId('lobby-component')).toBeInTheDocument();
    expect(screen.getByText(/test-game-id/)).toBeInTheDocument();
  });

  it('has correct main wrapper with styling classes', () => {
    const params = { id: 'game-1' };

    render(<Home params={params} />);

    // Find the main element and check it has expected classes
    const mainElement = screen.getByRole('main');
    expect(mainElement).toHaveClass('bg-green-500');
    expect(mainElement).toHaveClass('min-h-screen');
  });
});