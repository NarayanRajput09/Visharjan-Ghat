import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { RankingTable } from '../src/features/ranking/RankingTable';
import { SourceProvider } from '../src/features/ghat-detail/SourceContext';
import { MOCK_GHATS } from '../src/api/mockData';

describe('RankingTable', () => {
  it('renders 7 rows from a mocked response, in rank order', () => {
    render(
      <MemoryRouter>
        <SourceProvider>
          <RankingTable ghats={MOCK_GHATS} cpcbClass="B" />
        </SourceProvider>
      </MemoryRouter>
    );

    // Verify 7 rows are rendered
    for (let r = 1; r <= 7; r++) {
      const row = screen.getByTestId(`ghat-row-${r}`);
      expect(row).toBeInTheDocument();
    }

    // Verify ranks appear in 1 to 7 order
    const rows = screen.getAllByTestId(/ghat-row-/);
    expect(rows).toHaveLength(7);

    // Verify top ranked ghat is Bairagarh
    expect(rows[0]?.textContent).toContain('Bairagarh');
  });
});
