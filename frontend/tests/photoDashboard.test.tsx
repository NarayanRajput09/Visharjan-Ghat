import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HeroPanel } from '../src/components/dashboard/HeroPanel';
import { RiskSummary } from '../src/components/dashboard/RiskSummary';
import { Lightbox } from '../src/components/gallery/Lightbox';
import { GhatSearch } from '../src/components/ghats/GhatSearch';
import { GhatGrid } from '../src/components/ghats/GhatGrid';
import { EnvironmentalAssistant } from '../src/components/assistant/EnvironmentalAssistant';
import { GHATS_DATA } from '../src/data/ghats';
import { GALLERY_ITEMS } from '../src/data/gallery';

describe('HeroPanel Component', () => {
  it('renders title, subtitle, and 2x2 metrics grid', () => {
    const handleExplore = vi.fn();
    const handleOpenLightbox = vi.fn();

    render(
      <HeroPanel
        onExploreClick={handleExplore}
        onOpenLightbox={handleOpenLightbox}
      />
    );

    expect(screen.getByText(/Visarjan Ghat Environmental Intelligence/i)).toBeInTheDocument();
    expect(screen.getByText(/From Water Data to Civic Action/i)).toBeInTheDocument();
    expect(screen.getByText(/High-Risk Sites/i)).toBeInTheDocument();
    expect(screen.getByText(/Water Bodies/i)).toBeInTheDocument();

    // Explore CTA
    const exploreBtn = screen.getByRole('button', { name: /Explore Ghat Rankings/i });
    fireEvent.click(exploreBtn);
    expect(handleExplore).toHaveBeenCalledTimes(1);

    // Lightbox preview click
    const previewBtn = screen.getByRole('button', { name: /View high-resolution photograph of Water Sampling/i });
    fireEvent.click(previewBtn);
    expect(handleOpenLightbox).toHaveBeenCalledTimes(1);
  });
});

describe('RiskSummary Component', () => {
  it('renders all three risk tiers with correct counts and triggers filter callback', () => {
    const handleSelectTier = vi.fn();
    render(
      <RiskSummary
        ghats={GHATS_DATA}
        selectedTier="all"
        onSelectTier={handleSelectTier}
      />
    );

    expect(screen.getByText('HIGH RISK')).toBeInTheDocument();
    expect(screen.getByText('MEDIUM RISK')).toBeInTheDocument();
    expect(screen.getByText('LOW RISK')).toBeInTheDocument();

    const highTierCard = screen.getByText('HIGH RISK');
    fireEvent.click(highTierCard);
    expect(handleSelectTier).toHaveBeenCalledWith('high');
  });
});

describe('Lightbox Component', () => {
  it('renders modal dialog with photo, caption, and navigation', () => {
    const handleClose = vi.fn();
    const handleNavigate = vi.fn();
    const firstItem = GALLERY_ITEMS[0]!;

    render(
      <Lightbox
        item={firstItem}
        items={GALLERY_ITEMS}
        onClose={handleClose}
        onNavigate={handleNavigate}
      />
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText(firstItem.title)).toBeInTheDocument();
    expect(screen.getByText(firstItem.location)).toBeInTheDocument();

    // Close button
    const closeBtn = screen.getByRole('button', { name: /Close high-resolution lightbox/i });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});

describe('GhatSearch Component', () => {
  it('filters ghats by query and triggers selection callback', () => {
    const handleSelect = vi.fn();
    render(<GhatSearch onSelectGhat={handleSelect} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Bairagarh' } });

    // Expect dropdown to display Bairagarh
    const resultItem = screen.getByText(/Bairagarh \(Sant Hirdaram\) Kund/i);
    expect(resultItem).toBeInTheDocument();

    fireEvent.click(resultItem);
    expect(handleSelect).toHaveBeenCalledTimes(1);
    expect(handleSelect).toHaveBeenCalledWith(
      expect.objectContaining({ slug: 'bairagarh-sant-hirdaram-kund' })
    );
  });
});

describe('GhatGrid Component', () => {
  it('renders all 7 monitored ghats with metrics and handles selection', () => {
    const handleSelect = vi.fn();
    render(<GhatGrid ghats={GHATS_DATA} onSelectGhat={handleSelect} />);

    expect(screen.getByTestId('ghat-grid')).toBeInTheDocument();
    expect(screen.getByText(/Bairagarh \(Sant Hirdaram\) Kund/i)).toBeInTheDocument();
    expect(screen.getByText(/Khatlapura Ghat/i)).toBeInTheDocument();
    expect(screen.getByText(/Shahpura Lake Ghat \(BKE\)/i)).toBeInTheDocument();

    const detailButtons = screen.getAllByRole('button', { name: /View Details/i });
    expect(detailButtons.length).toBe(7);

    fireEvent.click(detailButtons[0]!);
    expect(handleSelect).toHaveBeenCalledTimes(1);
  });
});

describe('EnvironmentalAssistant Component', () => {
  it('renders preset inquiries and handles question interaction', () => {
    const handleClose = vi.fn();
    render(<EnvironmentalAssistant isOpen={true} onClose={handleClose} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/Bhopal Environmental Intelligence Assistant/i)).toBeInTheDocument();

    const presetBtn = screen.getByRole('button', {
      name: /Which ghats require priority monitoring in Bhopal\?/i,
    });
    expect(presetBtn).toBeInTheDocument();

    fireEvent.click(presetBtn);

    const closeBtn = screen.getByRole('button', { name: /Close AI assistant/i });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
