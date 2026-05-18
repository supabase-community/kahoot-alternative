import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Participant } from '@/types/types'
import Lobby from './lobby'

// Mock the types module to avoid Supabase initialization
jest.mock('@/types/types', () => {
  const mockSupabase = {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn(),
      insert: jest.fn().mockReturnThis(),
      single: jest.fn(),
    })),
    auth: {
      getSession: jest.fn(),
      signInAnonymously: jest.fn(),
    },
  }

  return {
    Participant: jest.fn(),
    supabase: mockSupabase,
  }
})

// Mock the next/navigation module to handle useRouter
jest.mock('next/navigation', () => ({
  useParams: () => ({ id: 'test-game-id' }),
  useRouter: jest.fn(),
}))

// Import the mocked supabase after the mock is set up
let supabase: any

beforeAll(() => {
  const typesModule = require('@/types/types')
  supabase = typesModule.supabase
})

describe('Lobby Component', () => {
  const mockOnRegisterCompleted = jest.fn()
  const mockGameId = 'test-game-id'
  const mockParticipant: Participant = {
    id: '1',
    nickname: 'Test Nickname',
    game_id: mockGameId,
    user_id: 'user-123',
    created_at: '2023-01-01T00:00:00Z',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    // Reset any global mocks
    ;(supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: null },
      error: null,
    })
    ;(supabase.auth.signInAnonymously as jest.Mock).mockResolvedValue({
      data: { user: { id: 'user-123' } },
      error: null,
    })
  })

  it('renders the register form initially when no participant exists', async () => {
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
    })

    render(
      <Lobby gameId={mockGameId} onRegisterCompleted={mockOnRegisterCompleted} />
    )

    expect(screen.getByPlaceholderText('Nickname')).toBeInTheDocument()
    expect(screen.getByText('Join')).toBeInTheDocument()
  })

  it('shows welcome message after participant registration', async () => {
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn().mockResolvedValue({ 
        data: mockParticipant, 
        error: null 
      }),
    })

    render(
      <Lobby gameId={mockGameId} onRegisterCompleted={mockOnRegisterCompleted} />
    )

    await waitFor(() => {
      expect(screen.getByText(`Welcome ${mockParticipant.nickname}！`)).toBeInTheDocument()
    })
    
    expect(screen.getByText(/sit back and wait/i)).toBeInTheDocument()
  })

  it('handles registration form submission correctly', async () => {
    const insertResponse = {
      data: mockParticipant,
      error: null,
    }

    // Mock the initial state where no participant exists yet
    ;(supabase.from as jest.Mock)
      .mockImplementationOnce((table: string) => {
        if (table === 'participants') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
          }
        }
      })
      .mockImplementationOnce((table: string) => {
        if (table === 'participants') {
          return {
            insert: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue(insertResponse),
          }
        }
      })

    render(
      <Lobby gameId={mockGameId} onRegisterCompleted={mockOnRegisterCompleted} />
    )

    // Wait for the effect to complete initial fetch
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Nickname')).toBeInTheDocument()
    })

    // Fill the form
    const nicknameInput = screen.getByPlaceholderText('Nickname')
    fireEvent.change(nicknameInput, { target: { value: 'Test Nickname' } })

    // Submit the form
    const joinButton = screen.getByText('Join')
    fireEvent.click(joinButton)

    // Wait for the form submission to complete
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('participants')
      expect(mockOnRegisterCompleted).toHaveBeenCalledWith(mockParticipant)
    })
  })

  it('shows error message when registration fails', async () => {
    const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {})
    const errorMessage = 'Registration failed'

    // Mock the initial state where no participant exists
    ;(supabase.from as jest.Mock)
      .mockImplementationOnce((table: string) => {
        if (table === 'participants') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
          }
        }
      })
      .mockImplementationOnce((table: string) => {
        if (table === 'participants') {
          return {
            insert: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({ 
              data: null, 
              error: { message: errorMessage } 
            }),
          }
        }
      })

    render(
      <Lobby gameId={mockGameId} onRegisterCompleted={mockOnRegisterCompleted} />
    )

    // Wait for the effect to complete initial fetch
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Nickname')).toBeInTheDocument()
    })

    // Fill the form
    const nicknameInput = screen.getByPlaceholderText('Nickname')
    fireEvent.change(nicknameInput, { target: { value: 'Test Nickname' } })

    // Submit the form
    const joinButton = screen.getByText('Join')
    fireEvent.click(joinButton)

    // Wait for the error to be handled
    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith(errorMessage)
    })

    mockAlert.mockRestore()
  })

  it('handles authentication properly', async () => {
    const mockSession = {
      data: { 
        session: { 
          user: { id: 'existing-user-id' } 
        } 
      },
      error: null,
    }

    ;(supabase.auth.getSession as jest.Mock).mockResolvedValue(mockSession)
    ;(supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
    })

    render(
      <Lobby gameId={mockGameId} onRegisterCompleted={mockOnRegisterCompleted} />
    )

    // Should not call signInAnonymously when session exists
    await waitFor(() => {
      expect(supabase.auth.signInAnonymously).not.toHaveBeenCalled()
    })
  })

  it('disables button during sending', async () => {
    // Initially mock no existing participant
    ;(supabase.from as jest.Mock)
      .mockImplementationOnce((table: string) => {
        if (table === 'participants') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
          }
        }
      })
      .mockImplementationOnce((table: string) => {
        // Delay the insertion to allow checking button state
        return {
          insert: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockImplementation(() => {
            return new Promise((resolve) => {
              setTimeout(() => resolve({ data: mockParticipant, error: null }), 100)
            })
          }),
        }
      })

    render(
      <Lobby gameId={mockGameId} onRegisterCompleted={mockOnRegisterCompleted} />
    )

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Nickname')).toBeInTheDocument()
    })

    // Fill the form
    const nicknameInput = screen.getByPlaceholderText('Nickname')
    fireEvent.change(nicknameInput, { target: { value: 'Test Nickname' } })

    // Click the join button
    const joinButton = screen.getByText('Join')
    fireEvent.click(joinButton)

    // Button should be disabled during submission
    expect(joinButton).toBeDisabled()
  })

  it('has maxLength attribute on nickname input', async () => {
    // Mock no existing participant
    ;(supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
    })

    render(
      <Lobby gameId={mockGameId} onRegisterCompleted={mockOnRegisterCompleted} />
    )

    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Nickname')).toBeInTheDocument()
    })

    const nicknameInput = screen.getByPlaceholderText('Nickname')
    expect(nicknameInput).toHaveAttribute('maxlength', '20');
  })

  it('calls onRegisterCompleted with participant data', async () => {
    // Mock the registration sequence
    ;(supabase.from as jest.Mock)
      .mockImplementationOnce((table: string) => {
        if (table === 'participants') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
          }
        }
      })
      .mockImplementationOnce((table: string) => {
        return {
          insert: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ 
            data: mockParticipant, 
            error: null 
          }),
        }
      })

    render(
      <Lobby gameId={mockGameId} onRegisterCompleted={mockOnRegisterCompleted} />
    )

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Nickname')).toBeInTheDocument()
    })

    const nicknameInput = screen.getByPlaceholderText('Nickname')
    fireEvent.change(nicknameInput, { target: { value: 'Test User' } })

    const joinButton = screen.getByText('Join')
    fireEvent.click(joinButton)

    await waitFor(() => {
      expect(mockOnRegisterCompleted).toHaveBeenCalledWith(mockParticipant)
    })
  })
})