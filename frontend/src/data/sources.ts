import type { SourceDocument } from '../types';

export const SOURCE_DOCUMENTS: SourceDocument[] = [
  {
    id: 'mppcb-2025',
    title: 'Ganesh and Durga Visarjan Water Quality Monitoring Report 2025',
    publisher: 'Madhya Pradesh Pollution Control Board (MPPCB)',
    year: 2025,
    url: 'https://www.mppcb.mp.gov.in/proc/mon/Ganesh_and_Durga_visarjan_report-2025.pdf',
    pages: 92,
    coverage_summary: 'Comprehensive testing across 7 Bhopal designated immersion ghats for Ganesh & Durga cycles.',
    previewImage: '/images/methodology/mppcb-official-report-cover.webp',
  },
  {
    id: 'mppcb-2024',
    title: 'Ganesh and Durga Visarjan Monitoring Report 2024',
    publisher: 'Madhya Pradesh Pollution Control Board (MPPCB)',
    year: 2024,
    url: 'https://www.mppcb.mp.gov.in/proc/mon/Ganesh_and_Durga_visarjan_report-2024.pdf',
    pages: 118,
    coverage_summary: 'Three-phase limnological surveillance (Pre, During, and Post Visarjan) with heavy metals assay.',
    previewImage: '/images/methodology/mppcb-official-report-cover.webp',
  },
  {
    id: 'mppcb-2023',
    title: 'Idol Immersion Environmental Monitoring Report 2023 (CPCB Format)',
    publisher: 'Madhya Pradesh Pollution Control Board (MPPCB)',
    year: 2023,
    url: 'https://www.mppcb.mp.gov.in/proc/mon/Idol_immer._Report_23_CPCB.pdf',
    pages: 87,
    coverage_summary: 'Standardized CPCB format dataset documenting acute deoxygenation incidents at Bairagarh and Khatlapura.',
    previewImage: '/images/methodology/mppcb-official-report-cover.webp',
  },
  {
    id: 'cpcb-standards',
    title: 'Central Pollution Control Board (CPCB) Designated Best Use Criteria',
    publisher: 'Central Pollution Control Board, Ministry of Environment, Forest & Climate Change',
    year: 2024,
    url: 'https://cpcb.gov.in/water-quality-criteria/',
    pages: 14,
    coverage_summary: 'Class B Outdoor Bathing Standard (Dissolved Oxygen ≥ 5.0 mg/L, BOD ≤ 3.0 mg/L, pH 6.5–8.5).',
    previewImage: '/images/methodology/cpcb-class-standards.webp',
  },
  {
    id: 'bmc-directives-fpj',
    title: 'Bhopal Municipal Corporation Visarjan Ghat Directives & Safety Operations',
    publisher: 'Free Press Journal / Civic Administration',
    year: 2024,
    url: 'https://www.freepressjournal.in/bhopal/bhopal-preparations-in-full-swing-for-ganesh-visarjan-divers-cranes-deployed-at-ghats',
    pages: 4,
    coverage_summary: 'Administrative deployment of SDRF divers, hydraulic cranes, containment booms, and artificial ponds at Khatlapura, Prempura, and Kamlapati.',
    previewImage: '/images/municipal-actions/lake-cleanup-boat.webp',
  },
  {
    id: 'toi-immersion-audit',
    title: 'Bhopal Lake Water Conservation & Artificial Immersion Ponds Mandate',
    publisher: 'The Times of India / MPPCB Surveillance',
    year: 2023,
    url: 'https://timesofindia.indiatimes.com/city/bhopal/artificial-ponds-at-ghats-for-visarjan-in-bhopal/articleshow/103986054.cms',
    pages: 3,
    coverage_summary: 'Mandatory creation of artificial masonry kunds to prevent toxic synthetic paint leaching into Bhojtal Upper Lake drinking water supply.',
    previewImage: '/images/water-quality/water-testing-lab-analysis.webp',
  },
];

export interface GhatMediaCitation {
  title: string;
  source: string;
  url: string;
  excerpt: string;
  date: string;
}

export const GHAT_MEDIA_CITATIONS: Record<string, GhatMediaCitation> = {
  'bairagarh-sant-hirdaram-kund': {
    title: 'BMC Artificial Immersion Kund & Mechanized Cranes at Bairagarh',
    source: 'The Times of India',
    url: 'https://timesofindia.indiatimes.com/city/bhopal/artificial-ponds-at-ghats-for-visarjan-in-bhopal/articleshow/103986054.cms',
    excerpt: 'Municipal corporation operationalizes dedicated artificial tanks at Sant Hirdaram Kund to isolate pooja offerings and heavy silt from Upper Lake main basin.',
    date: 'Sep 2024',
  },
  'khatlapura-ghat': {
    title: 'Khatlapura Ghat Multi-Tier Safety Protocols & SDRF Divers Deployment',
    source: 'Free Press Journal',
    url: 'https://www.freepressjournal.in/bhopal/bhopal-preparations-in-full-swing-for-ganesh-visarjan-divers-cranes-deployed-at-ghats',
    excerpt: 'Strict civic surveillance, safety boats, and rescue cordons installed at Khatlapura Lower Lake stone steps to enforce zero-casualty protocols.',
    date: 'Sep 2024',
  },
  'prempura-ghat': {
    title: 'Prempura Ghat Designated Immersion Corridor & Idol Handover Bays',
    source: 'Free Press Journal',
    url: 'https://www.freepressjournal.in/bhopal/bhopal-police-issue-traffic-advisory-ahead-of-visarjan-check-routes',
    excerpt: 'Primary high-capacity immersion corridor on Upper Lake Van Vihar fringe featuring specialized cranes and municipal collection kiosks.',
    date: 'Oct 2024',
  },
  'rani-kamlapati-ghat-kamla-park-kund': {
    title: 'Heritage Shoreline Immersion Guidelines at Kamla Park Ghat',
    source: 'The Times of India',
    url: 'https://timesofindia.indiatimes.com/city/bhopal/artificial-ponds-at-ghats-for-visarjan-in-bhopal/articleshow/103986054.cms',
    excerpt: 'Heritage zone regulations restricting idol dimensions and mandating floating booms around historic Kamla Park and Pul Pukhta channels.',
    date: 'Sep 2023',
  },
  'shahpura-lake-ghat': {
    title: 'Shahpura Lake Aeration Diffusers & Segregated Pooja Bays',
    source: 'Free Press Journal',
    url: 'https://www.freepressjournal.in/bhopal/bhopal-preparations-in-full-swing-for-ganesh-visarjan-divers-cranes-deployed-at-ghats',
    excerpt: 'Civic authorities operate round-the-clock surface aerators and separate waste kiosks along Shahpura Lake promenade to safeguard dissolved oxygen.',
    date: 'Sep 2024',
  },
  'shahpura-bke-ghat': {
    title: 'Shahpura Lake Aeration Diffusers & Segregated Pooja Bays',
    source: 'Free Press Journal',
    url: 'https://www.freepressjournal.in/bhopal/bhopal-preparations-in-full-swing-for-ganesh-visarjan-divers-cranes-deployed-at-ghats',
    excerpt: 'Civic authorities operate round-the-clock surface aerators and separate waste kiosks along Shahpura Lake promenade to safeguard dissolved oxygen.',
    date: 'Sep 2024',
  },
  'hathaikheda-dam-kund': {
    title: 'Hathaikheda Dam Perimeter Procession & Safety Watch',
    source: 'Free Press Journal',
    url: 'https://www.freepressjournal.in/bhopal/bhopal-police-issue-traffic-advisory-ahead-of-visarjan-check-routes',
    excerpt: 'Eastern suburb immersion hub monitored with perimeter floodlights, high-capacity cranes, and rapid-response motorized boats.',
    date: 'Oct 2024',
  },
  'malikhedi-kund': {
    title: 'Malikhedi & Malviya Masonry Tanks Overnight Silt Extraction',
    source: 'The Times of India',
    url: 'https://timesofindia.indiatimes.com/city/bhopal/artificial-ponds-at-ghats-for-visarjan-in-bhopal/articleshow/103986054.cms',
    excerpt: 'Dedicated masonry kunds enable sanitary workers to completely desilt and wash tanks immediately after festival immersion ceremonies.',
    date: 'Sep 2023',
  },
  'malviya-kund': {
    title: 'Malikhedi & Malviya Masonry Tanks Overnight Silt Extraction',
    source: 'The Times of India',
    url: 'https://timesofindia.indiatimes.com/city/bhopal/artificial-ponds-at-ghats-for-visarjan-in-bhopal/articleshow/103986054.cms',
    excerpt: 'Dedicated masonry kunds enable sanitary workers to completely desilt and wash tanks immediately after festival immersion ceremonies.',
    date: 'Sep 2023',
  },
};

export const METHODOLOGY_INFO = {
  dataset_period: '2023–2025 MPPCB Official Festival Cycles',
  interface_date: 'October 2026',
  evaluation_class: 'CPCB Class B (Outdoor Bathing)',
  risk_scoring_formula: 'Deterministic Composite Score = w_do * DO_Deficit + w_bod * BOD_Exceedance + w_vol * Volume_Risk',
  sampling_phases: ['Pre-Visarjan (Ambient Baseline)', 'During Visarjan (Peak Activity)', 'Post-Visarjan (Microbial Decomposition)'],
  disclaimer:
    'All water-quality figures are derived verbatim from published annual MPPCB environmental reports (2023–2025). The platform does not claim live real-time sensor telemetries or official BMC endorsement.',
};
