import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from './page';

// Define types directly to avoid importing from types.ts that initializes supabase client
type Choice = {
  body: string;
  created_at: string;
  id: string;
  is_correct: boolean;
  question_id: string;
};

type Question = {
  body: string;
  created_at: string;
  id: string;
  image_url: string | null;
  order: number;
  quiz_set_id: string;
  choices: Choice[];
};

type QuizSet = {
  id: string;
  name: string;
  created_at: string;
  description: string | null;
  questions: Question[];
};

// Mock window.open
const mockWindowOpen = jest.fn();
Object.defineProperty(window, 'open', {
  value: mockWindowOpen,
});

// Mock the entire types module to prevent the client from initializing
jest.mock('@/types/types', () => {
  // Create proper mock implementations for Supabase's method chaining
  const mockQuizSetsOrder = jest.fn(() => Promise.resolve({ data: [], error: null }));
  const mockQuizSetsSelect = jest.fn((selector) => ({ order: mockQuizSetsOrder }));

  // For successful game operations: from('games').insert({...}).select().single()
  const mockGamesSingleSuccess = jest.fn(() => Promise.resolve({ data: { id: 'game123' }, error: null }));
  const mockGamesSelectSuccess = jest.fn((selector) => ({ single: mockGamesSingleSuccess }));
  const mockGamesInsertSuccess = jest.fn((data) => ({ select: mockGamesSelectSuccess }));

  // For error game operations
  const mockGamesSingleError = jest.fn(() => Promise.resolve({ data: null, error: { message: 'Insert failed' } }));
  const mockGamesSelectError = jest.fn((selector) => ({ single: mockGamesSingleError }));
  const mockGamesInsertError = jest.fn((data) => ({ select: mockGamesSelectError }));

  const mockFrom = jest.fn((table: string) => {
    if (table === 'quiz_sets') {
      return { select: mockQuizSetsSelect };
    } else if (table === 'games') {
      // Default to success, can be overridden in individual tests
      return { insert: mockGamesInsertSuccess };
    }
    return { select: mockQuizSetsSelect };
  });

  const mockSupabase = {
    from: mockFrom,
    auth: {
      getSession: jest.fn(() => Promise.resolve({ data: { session: null }, error: null })),
      signInAnonymously: jest.fn(() => Promise.resolve({ data: { user: null, session: null }, error: null })),
    },
  };

  return {
    __esModule: true,
    QuizSet: {} as any,
    Question: {} as any,
    Choice: {} as any,
    supabase: mockSupabase,
  };
});

describe('Home Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockWindowOpen.mockClear();
  });

  it('renders without crashing', async () => {
    const { supabase } = require('@/types/types');

    // Mock an empty quiz set array
    const mockQuizSets: QuizSet[] = [];
    supabase.from('quiz_sets').select().order.mockResolvedValue({ data: mockQuizSets, error: null });

    render(<Home />);

    // Wait for the effects to run
    await waitFor(() => {
      // Check that the component rendered without crashing
    });
  });

  it('fetches quiz sets on mount', async () => {
    const { supabase } = require('@/types/types');

    const mockQuizSets: QuizSet[] = [
      {
        id: '1',
        name: 'Test Quiz',
        created_at: '2022-01-01T00:00:00Z',
        description: 'A test quiz',
        questions: [],
      },
    ];

    supabase.from('quiz_sets').select().order.mockResolvedValue({ data: mockQuizSets, error: null });

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Test Quiz')).toBeInTheDocument();
    });
  });

  it('displays quiz set name and question count', async () => {
    const { supabase } = require('@/types/types');

    const mockQuestions: Question[] = [
      {
        id: 'q1',
        body: 'Question 1',
        created_at: '2022-01-01T00:00:00Z',
        image_url: null,
        order: 1,
        quiz_set_id: '1',
        choices: [],
      },
      {
        id: 'q2',
        body: 'Question 2',
        created_at: '2022-01-01T00:00:00Z',
        image_url: null,
        order: 2,
        quiz_set_id: '1',
        choices: [],
      },
    ];

    const mockQuizSets: QuizSet[] = [
      {
        id: '1',
        name: 'Test Quiz',
        created_at: '2022-01-01T00:00:00Z',
        description: 'A test quiz',
        questions: mockQuestions,
      },
    ];

    supabase.from('quiz_sets').select().order.mockResolvedValue({ data: mockQuizSets, error: null });

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Test Quiz')).toBeInTheDocument();
      expect(screen.getByText('2 questions')).toBeInTheDocument();
    });
  });

  it('calls startGame when Start Game button is clicked', async () => {
    const { supabase } = require('@/types/types');

    const mockQuestions: Question[] = [
      {
        id: 'q1',
        body: 'Question 1',
        created_at: '2022-01-01T00:00:00Z',
        image_url: null,
        order: 1,
        quiz_set_id: '1',
        choices: [],
      },
    ];

    const mockQuizSets: QuizSet[] = [
      {
        id: '1',
        name: 'Test Quiz',
        created_at: '2022-01-01T00:00:00Z',
        description: 'A test quiz',
        questions: mockQuestions,
      },
    ];

    // Mock quiz sets fetch
    supabase.from('quiz_sets').select().order.mockResolvedValue({ data: mockQuizSets, error: null });

    // Mock game creation to succeed by temporarily overriding the from mock
    const originalFrom = supabase.from;
    const mockGamesSingle = jest.fn(() => Promise.resolve({ data: { id: 'game123' }, error: null }));
    const mockGamesSelect = jest.fn((selector) => ({ single: mockGamesSingle }));
    const mockGamesInsert = jest.fn((data) => ({ select: mockGamesSelect }));
    
    supabase.from = jest.fn((table: string) => {
      if (table === 'quiz_sets') {
        return { select: originalFrom('quiz_sets').select };
      } else if (table === 'games') {
        return { insert: mockGamesInsert };
      }
      return { select: originalFrom('quiz_sets').select };
    });

    render(<Home />);

    await waitFor(() => {
      const startButton = screen.getByRole('button', { name: /Start Game/i });
      expect(startButton).toBeInTheDocument();
      startButton.click();
    });

    await waitFor(() => {
      expect(mockWindowOpen).toHaveBeenCalledWith('/host/game/game123', '_blank', 'noopener,noreferrer');
    });
  });

  it('handles error when starting game fails', async () => {
    const { supabase } = require('@/types/types');

    const mockQuestions: Question[] = [
      {
        id: 'q1',
        body: 'Question 1',
        created_at: '2022-01-01T00:00:00Z',
        image_url: null,
        order: 1,
        quiz_set_id: '1',
        choices: [],
      },
    ];

    const mockQuizSets: QuizSet[] = [
      {
        id: '1',
        name: 'Test Quiz',
        created_at: '2022-01-01T00:00:00Z',
        description: 'A test quiz',
        questions: mockQuestions,
      },
    ];

    // Mock quiz sets fetch
    supabase.from('quiz_sets').select().order.mockResolvedValue({ data: mockQuizSets, error: null });

    // Mock game creation to fail by temporarily overriding the from mock
    const originalFrom = supabase.from;
    const mockGamesSingleError = jest.fn(() => Promise.resolve({ data: null, error: { message: 'Insert failed' } }));
    const mockGamesSelectError = jest.fn((selector) => ({ single: mockGamesSingleError }));
    const mockGamesInsertError = jest.fn((data) => ({ select: mockGamesSelectError }));

    supabase.from = jest.fn((table: string) => {
      if (table === 'quiz_sets') {
        return { select: originalFrom('quiz_sets').select };
      } else if (table === 'games') {
        return { insert: mockGamesInsertError };
      }
      return { select: originalFrom('quiz_sets').select };
    });

    // Mock alert
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation();

    render(<Home />);

    await waitFor(() => {
      const startButton = screen.getByRole('button', { name: /Start Game/i });
      expect(startButton).toBeInTheDocument();
      startButton.click();
    });

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Failed to start game');
    });

    alertSpy.mockRestore();
  });

  it('signs in anonymously if no session exists when starting game', async () => {
    const { supabase } = require('@/types/types');

    const mockQuestions: Question[] = [
      {
        id: 'q1',
        body: 'Question 1',
        created_at: '2022-01-01T00:00:00Z',
        image_url: null,
        order: 1,
        quiz_set_id: '1',
        choices: [],
      },
    ];

    const mockQuizSets: QuizSet[] = [
      {
        id: '1',
        name: 'Test Quiz',
        created_at: '2022-01-01T00:00:00Z',
        description: 'A test quiz',
        questions: mockQuestions,
      },
    ];

    // Mock quiz sets fetch
    supabase.from('quiz_sets').select().order.mockResolvedValue({ data: mockQuizSets, error: null });

    // Mock session to not exist initially, then succeed game creation
    supabase.auth.getSession.mockResolvedValue({ data: { session: null }, error: null });
    supabase.auth.signInAnonymously.mockResolvedValue({ data: { session: { user: { id: 'anonymous' } }, user: { id: 'anonymous' } }, error: null });

    // Mock game creation to succeed by temporarily overriding the from mock
    const originalFrom = supabase.from;
    const mockGamesSingle = jest.fn(() => Promise.resolve({ data: { id: 'game123' }, error: null }));
    const mockGamesSelect = jest.fn((selector) => ({ single: mockGamesSingle }));
    const mockGamesInsert = jest.fn((data) => ({ select: mockGamesSelect }));

    supabase.from = jest.fn((table: string) => {
      if (table === 'quiz_sets') {
        return { select: originalFrom('quiz_sets').select };
      } else if (table === 'games') {
        return { insert: mockGamesInsert };
      }
      return { select: originalFrom('quiz_sets').select };
    });

    render(<Home />);

    await waitFor(() => {
      const startButton = screen.getByRole('button', { name: /Start Game/i });
      expect(startButton).toBeInTheDocument();
      startButton.click();
    });

    await waitFor(() => {
      expect(supabase.auth.getSession).toHaveBeenCalled();
      expect(supabase.auth.signInAnonymously).toHaveBeenCalled();
      expect(mockWindowOpen).toHaveBeenCalledWith('/host/game/game123', '_blank', 'noopener,noreferrer');
    });
  });
});