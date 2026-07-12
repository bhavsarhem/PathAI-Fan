import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ZoneBadge from './ZoneBadge';

describe('ZoneBadge Component', () => {
  it('renders correct zone text', () => {
    render(<ZoneBadge zone="A" />);
    expect(screen.getByText('Zone A')).toBeInTheDocument();
  });

  it('applies correct size padding and styles', () => {
    const { container } = render(<ZoneBadge zone="B" size="sm" />);
    const span = container.querySelector('span');
    expect(span).toHaveStyle('padding: 2px 8px');
    expect(span).toHaveStyle('color: #DD6B20');
  });

  it('handles default styles correctly', () => {
    const { container } = render(<ZoneBadge zone="Z" />);
    const span = container.querySelector('span');
    expect(span).toHaveStyle('color: #555');
  });
});
