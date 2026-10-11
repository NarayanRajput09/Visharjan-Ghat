import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TierBadge } from '../src/components/TierBadge';

describe('TierBadge', () => {
  it('renders visible text label for high tier', () => {
    render(<TierBadge tier="high" />);
    const badge = screen.getByTestId('tier-badge');
    expect(badge).toBeInTheDocument();
    expect(badge.textContent?.trim().length).toBeGreaterThan(0);
    expect(badge.textContent).toMatch(/high|उच्च/i);
  });

  it('renders visible text label for medium tier', () => {
    render(<TierBadge tier="medium" />);
    const badge = screen.getByTestId('tier-badge');
    expect(badge).toBeInTheDocument();
    expect(badge.textContent?.trim().length).toBeGreaterThan(0);
    expect(badge.textContent).toMatch(/medium|मध्यम/i);
  });

  it('renders visible text label for low tier', () => {
    render(<TierBadge tier="low" />);
    const badge = screen.getByTestId('tier-badge');
    expect(badge).toBeInTheDocument();
    expect(badge.textContent?.trim().length).toBeGreaterThan(0);
    expect(badge.textContent).toMatch(/low|निम्न/i);
  });
});
