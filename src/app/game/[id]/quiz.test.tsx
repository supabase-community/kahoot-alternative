import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { TIME_TIL_CHOICE_REVEAL, QUESTION_ANSWER_TIME } from '@/constants';

// Mock the react-countdown-circle-timer
jest.mock('react-countdown-circle-timer', () => ({
  CountdownCircleTimer: ({ onComplete, duration }: any) => {
    // Simulate the timer completing immediately in tests
    setTimeout(() => {
      onComplete();
    }, 0);

    return <div>Countdown Timer (duration: {duration}s)</div>;
  },
}));

// Define the types that we need for the test
type Choice = {
  id: string;
  body: string;
  is_correct: boolean;
  question_id: string;
  created_at: string;
};

type Question = {
  id: string;
  body: string;
  order: number;
  quiz_set_id: string;
  created_at: string;
  image_url: string | null;
  choices: Choice[];
};

// Mock the supabase client separately to access it in tests
const mockInsert = jest.fn();
jest.mock('@/types/types', () => {
  return {
    // Re-export the constants
    QUESTION_ANSWER_TIME: 20000,
    TIME_TIL_CHOICE_REVEAL: 5000,
    // Mock the supabase
    supabase: {
      from: jest.fn(() => ({
        insert: mockInsert,
      })),
    },
  };
});

import Quiz from './quiz';

describe('Quiz Component', () => {
  const mockChoice1: Choice = {
    id: 'choice1',
    body: 'Choice A',
    is_correct: true,
    question_id: 'question1',
    created_at: '2023-01-01T00:00:00Z',
  };

  const mockChoice2: Choice = {
    id: 'choice2',
    body: 'Choice B',
    is_correct: false,
    question_id: 'question1',
    created_at: '2023-01-01T00:00:00Z',
  };

  const mockQuestion: Question = {
    id: 'question1',
    body: 'What is the capital of France?',
    order: 0,
    quiz_set_id: 'quizset1',
    created_at: '2023-01-01T00:00:00Z',
    image_url: null,
    choices: [mockChoice1, mockChoice2],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders the question correctly', () => {
    render(
      <Quiz
        question={mockQuestion}
        questionCount={5}
        participantId="participant1"
        isAnswerRevealed={false}
      />
    );

    expect(screen.getByText('What is the capital of France?')).toBeInTheDocument();
    expect(screen.getByText('1/5')).toBeInTheDocument();
  });

  it('shows choices after the countdown timer completes', async () => {
    render(
      <Quiz
        question={mockQuestion}
        questionCount={5}
        participantId="participant1"
        isAnswerRevealed={false}
      />
    );

    // Initially, choices should not be visible because of the countdown timer
    expect(screen.queryByText('Choice A')).not.toBeInTheDocument();
    expect(screen.queryByText('Choice B')).not.toBeInTheDocument();

    // Advance timers to trigger the timer completion
    act(() => {
      jest.runOnlyPendingTimers();
    });

    // After the timer completes, choices should be visible
    await waitFor(() => {
      expect(screen.getByText('Choice A')).toBeInTheDocument();
    });

    expect(screen.getByText('Choice B')).toBeInTheDocument();
  });

  it('allows selecting a choice and sends answer to backend', async () => {
    mockInsert.mockResolvedValue({ error: null });

    render(
      <Quiz
        question={mockQuestion}
        questionCount={5}
        participantId="participant1"
        isAnswerRevealed={false}
      />
    );

    // Advance timers to show choices
    act(() => {
      jest.runOnlyPendingTimers();
    });

    // Wait for choices to appear
    await waitFor(() => {
      expect(screen.getByText('Choice A')).toBeInTheDocument();
    });

    // Select the first choice
    fireEvent.click(screen.getByText('Choice A'));

    // Verify that the supabase insert function was called
    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalledWith({
        participant_id: 'participant1',
        question_id: 'question1',
        choice_id: 'choice1',
        score: expect.any(Number),
      });
    });
  });

  it('disables buttons after selection', async () => {
    mockInsert.mockResolvedValue({ error: null });

    render(
      <Quiz
        question={mockQuestion}
        questionCount={5}
        participantId="participant1"
        isAnswerRevealed={false}
      />
    );

    // Advance timers to show choices
    act(() => {
      jest.runOnlyPendingTimers();
    });

    // Wait for choices to appear
    await waitFor(() => {
      expect(screen.getByText('Choice A')).toBeInTheDocument();
    });

    // Select a choice
    fireEvent.click(screen.getByText('Choice A'));

    // Wait for the answer submission
    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalled();
    });

    // Buttons should no longer be in the DOM after selection since "Wait for others..." message appears
    expect(screen.queryByText('Choice A')).not.toBeInTheDocument();
    expect(screen.queryByText('Choice B')).not.toBeInTheDocument();
  });

  it('shows "Wait for others to answer..." message after selection', async () => {
    mockInsert.mockResolvedValue({ error: null });

    render(
      <Quiz
        question={mockQuestion}
        questionCount={5}
        participantId="participant1"
        isAnswerRevealed={false}
      />
    );

    // Advance timers to show choices
    act(() => {
      jest.runOnlyPendingTimers();
    });

    // Wait for choices to appear
    await waitFor(() => {
      expect(screen.getByText('Choice A')).toBeInTheDocument();
    });

    // Select a choice
    fireEvent.click(screen.getByText('Choice A'));

    // The "Wait for others to answer..." message should appear
    expect(screen.getByText('Wait for others to answer...')).toBeInTheDocument();
  });

  it('displays correct/incorrect message when isAnswerRevealed is true', async () => {
    render(
      <Quiz
        question={mockQuestion}
        questionCount={5}
        participantId="participant1"
        isAnswerRevealed={true}
      />
    );

    // When isAnswerRevealed is true and no choice was selected, it shows the default message
    // Based on the quiz code, when chosenChoice is null, it will show "Incorrect" (because null?.is_correct is falsy)
    expect(screen.getByText('Incorrect')).toBeInTheDocument();
  });

  it('calculates score correctly based on time taken', async () => {
    mockInsert.mockResolvedValue({ error: null });

    render(
      <Quiz
        question={mockQuestion}
        questionCount={5}
        participantId="participant1"
        isAnswerRevealed={false}
      />
    );

    // Advance timers to show choices
    act(() => {
      jest.runOnlyPendingTimers();
    });

    // Wait for choices to appear
    await waitFor(() => {
      expect(screen.getByText('Choice A')).toBeInTheDocument();
    });

    // Mock Date.now to simulate taking 10 seconds to answer out of 20 seconds max
    const originalDateNow = Date.now;
    const initialTime = Date.now();
    Date.now = jest.fn(() => initialTime + 10000); // 10 seconds later

    fireEvent.click(screen.getByText('Choice A'));

    // Verify that score calculation is correct
    // Score = 1000 - round(max(0, min((timeTaken/QUESTION_ANSWER_TIME), 1)) * 1000)
    // Score = 1000 - round(min((10000/20000), 1) * 1000) = 1000 - round(0.5 * 1000) = 500
    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalledWith({
        participant_id: 'participant1',
        question_id: 'question1',
        choice_id: 'choice1',
        score: 500, // Half of max points since halfway through time
      });
    });

    // Restore Date.now
    Date.now = originalDateNow;
  });

  it('gives 0 points for wrong answers', async () => {
    mockInsert.mockResolvedValue({ error: null });

    render(
      <Quiz
        question={{
          ...mockQuestion,
          choices: [
            { ...mockChoice1, is_correct: false },
            { ...mockChoice2, is_correct: true },
          ] // Swap the correct answer
        }}
        questionCount={5}
        participantId="participant1"
        isAnswerRevealed={false}
      />
    );

    // Advance timers to show choices
    act(() => {
      jest.runOnlyPendingTimers();
    });

    // Wait for choices to appear
    await waitFor(() => {
      expect(screen.getByText('Choice A')).toBeInTheDocument();
    });

    // Select the wrong choice
    fireEvent.click(screen.getByText('Choice A'));

    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalledWith({
        participant_id: 'participant1',
        question_id: 'question1',
        choice_id: 'choice1',
        score: 0, // Wrong answers get 0 points
      });
    });
  });

  it('handles error when sending answer to backend', async () => {
    const errorMessage = 'Database error';
    mockInsert.mockResolvedValue({ error: { message: errorMessage } });

    // Mock alert to verify it's called
    window.alert = jest.fn();

    render(
      <Quiz
        question={mockQuestion}
        questionCount={5}
        participantId="participant1"
        isAnswerRevealed={false}
      />
    );

    // Advance timers to show choices
    act(() => {
      jest.runOnlyPendingTimers();
    });

    // Wait for choices to appear
    await waitFor(() => {
      expect(screen.getByText('Choice A')).toBeInTheDocument();
    });

    // Select a choice
    fireEvent.click(screen.getByText('Choice A'));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(errorMessage);
    });
  });

  it('resets state when question ID changes', async () => {
    const { rerender } = render(
      <Quiz
        question={mockQuestion}
        questionCount={5}
        participantId="participant1"
        isAnswerRevealed={false}
      />
    );

    // Advance timers to show choices
    act(() => {
      jest.runOnlyPendingTimers();
    });

    await waitFor(() => {
      expect(screen.getByText('Choice A')).toBeInTheDocument();
    });

    // Select a choice
    fireEvent.click(screen.getByText('Choice A'));

    // Verify choice was selected
    expect(screen.getByText('Wait for others to answer...')).toBeInTheDocument();

    // Rerender with a different question ID
    const newQuestion = {
      ...mockQuestion,
      id: 'different-question-id',
    };

    rerender(
      <Quiz
        question={newQuestion}
        questionCount={5}
        participantId="participant1"
        isAnswerRevealed={false}
      />
    );

    // The "Wait for others to answer..." message should disappear because state was reset
    // Since the timer starts again, we should see the countdown message again or the choices
    // after it completes
    act(() => {
      jest.runOnlyPendingTimers();
    });

    // After timer completes with the new question, choices should appear again
    await waitFor(() => {
      expect(screen.getByText('Choice A')).toBeInTheDocument();
    });
  });

  it('disables buttons when answer is revealed', async () => {
    render(
      <Quiz
        question={mockQuestion}
        questionCount={5}
        participantId="participant1"
        isAnswerRevealed={true}
      />
    );

    // When answer is revealed, the choices section shouldn't be shown
    // Instead, the correct/incorrect result should be shown
    expect(screen.getByText('Incorrect')).toBeInTheDocument();

    // Choices shouldn't be in the document when isAnswerRevealed is true
    expect(screen.queryByText('Choice A')).not.toBeInTheDocument();
    expect(screen.queryByText('Choice B')).not.toBeInTheDocument();
  });
});