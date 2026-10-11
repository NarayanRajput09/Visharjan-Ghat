import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ReadingCell } from '../src/components/ReadingCell';
import type { components } from '../src/api/schema';

type Reading = components['schemas']['Reading'];

describe('ReadingCell', () => {
  it('renders "Not tested" for not_sampled and has grey styling with no tick', () => {
    const reading: Reading = {
      id: 1,
      reading_id: 1,
      site_slug: 'bairagarh-sant-hirdaram-kund',
      parameter: 'Dissolved oxygen',
      year: 2025,
      festival: 'Durga',
      phase: 'during',
      status: 'not_sampled',
      value: null,
      unit_assumed: 'mg/l',
      value_as_printed: 'not sampled',
      parameter_as_printed: 'D.Oxygen',
      site_as_printed: 'Bairagarh',
      source_page: 60,
    };

    render(<ReadingCell reading={reading} />);
    const cell = screen.getByTestId('reading-cell-not-sampled');
    expect(cell).toBeInTheDocument();
    expect(cell.textContent).toMatch(/not tested|जाँच नहीं हुई/i);
    expect(cell.className).toContain('bg-status-missing');
    expect(cell.className).not.toContain('bg-emerald');
    // Ensure no green tick icon exists
    expect(cell.querySelector('svg')).toBeNull();
  });

  it('renders "Below detection limit" for bdl status', () => {
    const reading: Reading = {
      id: 2,
      reading_id: 2,
      site_slug: 'khatlapura-ghat',
      parameter: 'Lead',
      year: 2024,
      festival: 'Durga',
      phase: 'after',
      status: 'bdl',
      value: null,
      unit_assumed: 'mg/l',
      value_as_printed: 'BDL',
      parameter_as_printed: 'Lead',
      site_as_printed: 'Khatlapura',
      source_page: 52,
    };

    render(<ReadingCell reading={reading} />);
    const cell = screen.getByTestId('reading-cell-bdl');
    expect(cell).toBeInTheDocument();
    expect(cell.textContent).toMatch(/below detection limit|पहचान सीमा से नीचे/i);
  });

  it('renders numeric value with unit for measured status', () => {
    const reading: Reading = {
      id: 3,
      reading_id: 3,
      site_slug: 'bairagarh-sant-hirdaram-kund',
      parameter: 'Dissolved oxygen',
      year: 2023,
      festival: 'Durga',
      phase: 'during',
      status: 'measured',
      value: 0,
      unit_assumed: 'mg/l',
      value_as_printed: '0.0',
      parameter_as_printed: 'D.Oxygen',
      site_as_printed: 'Bairagarh',
      source_page: 60,
    };

    render(<ReadingCell reading={reading} />);
    const cell = screen.getByTestId('reading-cell-measured');
    expect(cell).toBeInTheDocument();
    expect(cell.textContent).toContain('0 mg/l');
  });
});
