import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ChatBar from './ChatBar';
import * as ChatContext from '../context/ChatContext';

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn()
}));

describe('ChatBar Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders correctly and toggles state', () => {
    const mockSetIsOpen = vi.fn();
    vi.spyOn(ChatContext, 'useChat').mockReturnValue({
      messages: [],
      sendMessage: vi.fn(),
      isOpen: false,
      setIsOpen: mockSetIsOpen,
      isLoading: false
    });

    render(<ChatBar />);
    
    const toggleBtn = screen.getByRole('button', { name: /Toggle AI Assistant/i });
    expect(toggleBtn).toBeInTheDocument();
    
    fireEvent.click(toggleBtn);
    expect(mockSetIsOpen).toHaveBeenCalled();
  });

  it('renders messages and handles typing and sending', () => {
    const mockSendMessage = vi.fn();
    vi.spyOn(ChatContext, 'useChat').mockReturnValue({
      messages: [
        { id: 1, role: 'ai', text: 'Hi! how can I help?' },
        { id: 2, role: 'user', text: 'Where is parking?' }
      ],
      sendMessage: mockSendMessage,
      isOpen: true,
      setIsOpen: vi.fn(),
      isLoading: false
    });

    render(<ChatBar />);
    
    expect(screen.getByText('Hi! how can I help?')).toBeInTheDocument();
    expect(screen.getByText('Where is parking?')).toBeInTheDocument();

    const input = screen.getByPlaceholderText('Ask anything about the stadium...');
    fireEvent.change(input, { target: { value: 'washroom' } });
    expect(input.value).toBe('washroom');

    const sendBtn = screen.getByRole('button', { name: /Send Message/i });
    fireEvent.click(sendBtn);
    expect(mockSendMessage).toHaveBeenCalledWith('washroom', expect.any(Function));
  });
});
