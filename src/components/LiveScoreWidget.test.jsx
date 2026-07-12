import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LiveScoreWidget from './LiveScoreWidget';

describe('LiveScoreWidget Component', () => {
  it('renders loading text when loading is true', () => {
    render(<LiveScoreWidget data={{ loading: true }} />);
    expect(screen.getByText('Loading Live Data...')).toBeInTheDocument();
  });

  it('renders compact view correctly', () => {
    const mockData = {
      featuredMatch: {
        id: '123',
        statusState: 'in',
        statusDetail: "75'",
        home: { name: 'Spain', score: '2' },
        away: { name: 'France', score: '1' }
      }
    };
    const onClick = vi.fn();
    render(<LiveScoreWidget data={mockData} compact onClick={onClick} />);
    
    expect(screen.getByText('Spain 2 – 1 France')).toBeInTheDocument();
    expect(screen.getByText("75'")).toBeInTheDocument();
    
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });

  it('renders detailed view correctly', () => {
    const mockData = {
      featuredMatch: {
        id: '123',
        statusState: 'pre',
        statusDetail: "3:00 PM",
        home: { name: 'Spain', score: '0' },
        away: { name: 'France', score: '0' }
      }
    };
    render(<LiveScoreWidget data={mockData} />);
    
    expect(screen.getByText('UPCOMING')).toBeInTheDocument();
    expect(screen.getByText('Spain')).toBeInTheDocument();
    expect(screen.getByText('France')).toBeInTheDocument();
    expect(screen.getByText('VS')).toBeInTheDocument();
  });
});
