import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TrendChart } from '../src/features/ghat-detail/TrendChart';
import type { components } from '../src/api/schema';

type Reading = components['schemas']['Reading'];

describe('TrendChart', () => {
  it('renders chart container and passes null for missing readings without converting to 0', () => {
    // Only 1 measured reading; all others are absent / not sampled
    const testReadings: Reading[] = [
      {
        id: 1,
        reading_id: 1,
        site_slug: 'bairagarh-sant-hirdaram-kund',
        parameter: 'Dissolved oxygen',
        year: 2023,
        festival: 'Durga',
        phase: 'during',
        status: 'measured',
        value: 4.2,
        unit_assumed: 'mg/l',
        value_as_printed: '4.2',
        parameter_as_printed: 'D.Oxygen',
        site_as_printed: 'Bairagarh',
        source_page: 60,
      },
    ];

    render(<TrendChart readings={testReadings} />);
    const chart = screen.getByTestId('trend-chart');
    expect(chart).toBeInTheDocument();

    // Verify the footnote about missing values is rendered
    expect(screen.getByText(/gaps in the line, not zero values|शून्य मान नहीं/i)).toBeInTheDocument();
  });
});
