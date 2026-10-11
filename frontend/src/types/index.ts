export type RiskTier = 'high' | 'medium' | 'low';
export type ConfidenceLevel = 'good' | 'limited' | 'poor';
export type CPCBClass = 'B' | 'C' | 'D';

export interface HistoricalReading {
  date: string;
  festival: 'Ganesh' | 'Durga';
  year: number;
  phase: 'pre' | 'during' | 'after';
  do: number | null; // null represents missing / not sampled
  bod: number | null;
  ph: number | null;
  turbidity?: number | null;
  source_page?: number;
}

export interface GhatRecord {
  id: string;
  slug: string;
  rank: number;
  name_en: string;
  name_hi: string;
  water_body: string;
  locality: string;
  nearest_landmark: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
  imageSource: string;
  imageAlt: string;
  galleryImages: string[];
  risk_tier: RiskTier;
  score: number;
  confidence: ConfidenceLevel;
  confidence_reason: string;
  key_concern: string;
  lowest_do: number;
  peak_bod: number;
  avg_ph: number;
  turbidity_ntu: number;
  monitoring_coverage: string;
  sample_count: number;
  latest_sample_date: string;
  reasons: Array<{
    kind: string;
    text: string;
    reading_id?: number;
  }>;
  suggested_actions: string[];
  data_provenance: {
    agency: string;
    reports: string[];
    certificate_available: boolean;
    certificate_id?: string;
    notes: string;
  };
  historical_trends: HistoricalReading[];
}

export interface GalleryRecord {
  id: string;
  title: string;
  category:
    | 'Ramsar Wetland'
    | 'Heritage Shoreline'
    | 'Urban Lake'
    | 'Civic Immersion Site'
    | 'Scientific Testing'
    | 'Municipal Action';
  location: string;
  imageUrl: string;
  imageSource: string;
  alt: string;
  caption: string;
  latitude: number;
  longitude: number;
  inspection_notes?: string;
}

export interface SourceDocument {
  id: string;
  title: string;
  publisher: string;
  year: number;
  url: string;
  pages: number;
  coverage_summary: string;
  previewImage: string;
}
