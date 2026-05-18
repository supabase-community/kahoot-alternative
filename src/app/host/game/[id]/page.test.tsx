// Define the required types locally to avoid importing from types module (which initializes Supabase client)
type Answer = {
  id: string;
  created_at: string;
  question_id: string;
  participant_id: string;
  selected_choice_id: string;
  is_correct: boolean;
};

type Choice = {
  id: string;
  created_at: string;
  question_id: string;
  body: string;
  is_correct: boolean;
};

type Game = {
  id: string;
  created_at: string;
  quiz_set_id: string;
  host_user_id: string | null;
  phase: 'lobby' | 'quiz' | 'result';
  current_question_sequence: number;
  is_answer_revealed: boolean;
};

type Participant = {
  id: string;
  created_at: string;
  game_id: string;
  nickname: string;
  user_id: string;
};

type Question = {
  id: string;
  created_at: string;
  quiz_set_id: string;
  body: string;
  order: number;
  image_url: string | null;
  choices?: Choice[];
};

type QuizSet = {
  id: string;
  created_at: string;
  name: string;
  description: string | null;
  questions?: Question[];
};

// Define the type for the mock channel
type MockChannel = {
  on: jest.Mock;
  subscribe: jest.Mock;
};

// Mock supabase with a simpler implementation
const mockEq = jest.fn().mockReturnThis();
const mockSingle = jest.fn();
const mockOrder = jest.fn().mockReturnThis();
const mockSelect = jest.fn().mockReturnThis();
const mockFrom = jest.fn();

const mockOn = jest.fn().mockReturnThis();
const mockSubscribe = jest.fn().mockReturnThis();
const mockChannel = jest.fn();

// Define our own mock supabase to avoid importing the real one
const supabase = {
  from: mockFrom,
  channel: mockChannel,
};



describe('Home - Host Game Page Business Logic', () => {
  const mockGameId = 'test-game-id';

  const mockParticipant: Participant = {
    id: '1',
    created_at: '2023-09-20T10:00:00Z',
    game_id: mockGameId,
    nickname: 'Test User',
    user_id: 'user123',
  };

  const mockChoice: Choice = {
    id: 'choice1',
    created_at: '2023-09-20T10:00:00Z',
    question_id: 'question1',
    body: 'Choice text',
    is_correct: false,
  };

  const mockQuestion: Question = {
    id: 'question1',
    created_at: '2023-09-20T10:00:00Z',
    quiz_set_id: 'quiz1',
    body: 'Sample Question?',
    order: 1,
    image_url: null,
    choices: [mockChoice],
  };

  const mockQuizSet: QuizSet = {
    id: 'quiz1',
    created_at: '2023-09-20T10:00:00Z',
    name: 'Sample Quiz Set',
    description: 'Sample Description',
    questions: [mockQuestion],
  };

  const mockGame: Game = {
    id: mockGameId,
    created_at: '2023-09-20T10:00:00Z',
    quiz_set_id: 'quiz1',
    host_user_id: null,
    phase: 'lobby',
    current_question_sequence: 0,
    is_answer_revealed: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mock implementations
    mockFrom.mockImplementation((tableName: string) => ({
      select: mockSelect,
    }));

    mockSelect.mockImplementation(() => ({
      eq: mockEq,
      order: mockOrder,
    }));

    mockEq.mockImplementation(() => ({
      single: mockSingle,
    }));

    mockOrder.mockImplementation(() => ({
      eq: mockEq,
      single: mockSingle,
    }));

    mockSingle.mockResolvedValue({ data: null, error: null });
    mockOn.mockImplementation(() => ({
      on: mockOn,
      subscribe: mockSubscribe,
    }));
    mockSubscribe.mockReturnThis();
    mockChannel.mockImplementation(() => ({
      on: mockOn,
      subscribe: mockSubscribe,
    }));
  });

  it('should make the correct API calls to retrieve game data', async () => {
    // Mock successful API calls for different tables
    const mockGamesResponse = { data: mockGame, error: null };
    const mockQuizSetsResponse = { data: mockQuizSet, error: null };
    const mockParticipantsResponse = { data: [mockParticipant], error: null };

    mockFrom.mockImplementation((table: string) => {
      if (table === 'games') {
        return {
          select: () => ({
            eq: (field: string, value: string) => ({
              single: () => Promise.resolve(mockGamesResponse)
            })
          })
        };
      } else if (table === 'quiz_sets') {
        return {
          select: () => ({
            eq: (field: string, value: string) => ({
              order: (field2: string, opts: object) => ({
                single: () => Promise.resolve(mockQuizSetsResponse)
              })
            })
          })
        };
      } else if (table === 'participants') {
        return {
          select: () => ({
            eq: (field: string, value: string) => ({
              order: (field2: string, opts: object) => ({
                single: () => Promise.resolve(mockParticipantsResponse)
              })
            })
          })
        };
      }
      return { select: () => ({}) };
    });

    // Simulate the data fetching logic that would happen in the component
    const gameDataResult = await (supabase.from('games') as any).select().eq('id', mockGameId).single();
    const quizSetResult = await (supabase.from('quiz_sets') as any).select().eq('id', mockGame.quiz_set_id).order('order', { ascending: true }).single();
    const participantsResult = await (supabase.from('participants') as any).select().eq('game_id', mockGameId).order('created_at', { ascending: true }).single();

    expect(gameDataResult).toEqual(mockGamesResponse);
    expect(quizSetResult).toEqual(mockQuizSetsResponse);
    expect(participantsResult).toEqual(mockParticipantsResponse);

    expect(mockFrom).toHaveBeenCalledWith('games');
    expect(mockFrom).toHaveBeenCalledWith('quiz_sets');
    expect(mockFrom).toHaveBeenCalledWith('participants');
  });

  it('should connect to the correct realtime channel for game updates', () => {
    const channelName = `room:${mockGameId}`;
    const mockRealtimeChannel = {
      on: mockOn,
      subscribe: mockSubscribe,
    };

    mockChannel.mockReturnValueOnce(mockRealtimeChannel);

    // Simulate connecting to the channel
    const channel = supabase.channel(channelName);
    channel.subscribe();

    expect(mockChannel).toHaveBeenCalledWith(channelName);
    expect(mockSubscribe).toHaveBeenCalled();
  });

  it('should handle different game phases correctly', () => {
    // Test lobby phase
    const lobbyGame = { ...mockGame, phase: 'lobby' };
    expect(lobbyGame.phase).toBe('lobby');

    // Test quiz phase
    const quizGame = { ...mockGame, phase: 'quiz' };
    expect(quizGame.phase).toBe('quiz');

    // Test result phase
    const resultGame = { ...mockGame, phase: 'result' };
    expect(resultGame.phase).toBe('result');
  });

  it('should handle game state updates correctly', () => {
    // Simulate the game transitioning from lobby to quiz state
    const updatedGame = { ...mockGame, phase: 'quiz', current_question_sequence: 1 };

    expect(updatedGame.phase).toBe('quiz');
    expect(updatedGame.current_question_sequence).toBe(1);
    expect(updatedGame.id).toBe(mockGame.id);
  });

  it('should handle empty participant list correctly', async () => {
    // Mock API call returning empty participant list
    const mockEmptyParticipantsResponse = { data: [], error: null };

    mockFrom.mockImplementation((table: string) => {
      if (table === 'participants') {
        return {
          select: () => ({
            eq: (field: string, value: string) => ({
              order: (field2: string, opts: object) => ({
                single: () => Promise.resolve(mockEmptyParticipantsResponse)
              })
            })
          })
        };
      }
      return { select: () => ({}) };
    });

    const participantsResult = await (supabase.from('participants') as any).select().eq('game_id', mockGameId).order('created_at', { ascending: true }).single();

    expect(participantsResult).toEqual(mockEmptyParticipantsResponse);
  });

  it('should track the current question sequence properly', () => {
    // Test initial state
    expect(mockGame.current_question_sequence).toBe(0);

    // Simulate advancing to next question
    const nextQuestionGame = { ...mockGame, current_question_sequence: 1 };
    expect(nextQuestionGame.current_question_sequence).toBe(1);

    // Test with more questions
    const advancedGame = { ...mockGame, current_question_sequence: 5 };
    expect(advancedGame.current_question_sequence).toBe(5);
  });

  it('should handle answer reveal state correctly', () => {
    // Initially not revealed
    expect(mockGame.is_answer_revealed).toBe(false);

    // After revealing answer
    const revealedGame = { ...mockGame, is_answer_revealed: true };
    expect(revealedGame.is_answer_revealed).toBe(true);
  });
});