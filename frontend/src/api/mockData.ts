import type { components } from './schema';

type RankedGhat = components['schemas']['RankedGhat'];
type Reading = components['schemas']['Reading'];
type GhatDetailResponse = components['schemas']['GhatDetailResponse'];
type BriefResponse = components['schemas']['BriefResponse'];
type LimitsResponse = components['schemas']['LimitsResponse'];
type ParametersResponse = components['schemas']['ParametersResponse'];

export const MOCK_GHATS: RankedGhat[] = [
  {
    rank: 1,
    slug: 'bairagarh-sant-hirdaram-kund',
    name_en: 'Bairagarh (Sant Hirdaram) kund',
    name_hi: 'बैरागढ़ (संत हिरदाराम) कुंड',
    water_body: 'Upper Lake',
    score: 78.4,
    tier: 'high',
    confidence: 'limited',
    site_match_confidence: 'high',
    reasons: [
      {
        kind: 'worst_do',
        params: { value: 0, festival: 'Durga', year: 2023, phase: 'during', limit: 5 },
        reading_ids: [101],
      },
      {
        kind: 'bod_exceedance',
        params: { exceeded: 14, total: 14, max: 28.0 },
        reading_ids: [102, 103],
      },
      {
        kind: 'data_gap',
        params: { sampled_count: 8 },
        reading_ids: [],
      },
    ],
    suggested_actions: ['action_aeration', 'action_cleaning', 'action_post_test'],
    known_gaps: ['gap_no_durga_2025'],
    lat: 23.2682,
    lng: 77.3401,
  },
  {
    rank: 2,
    slug: 'khatlapura-ghat',
    name_en: 'Khatlapura ghat',
    name_hi: 'खटलापुरा घाट',
    water_body: 'Lower Lake',
    score: 52.1,
    tier: 'high',
    confidence: 'good',
    site_match_confidence: 'high',
    reasons: [
      {
        kind: 'worst_do',
        params: { value: 1.8, festival: 'Durga', year: 2024, phase: 'during', limit: 5 },
        reading_ids: [201],
      },
      {
        kind: 'bod_exceedance',
        params: { exceeded: 16, total: 18, max: 19.5 },
        reading_ids: [202],
      },
      {
        kind: 'trend',
        params: { earliest_year: 2023, latest_year: 2025 },
        reading_ids: [],
      },
    ],
    suggested_actions: ['action_aeration', 'action_cleaning', 'action_post_test'],
    known_gaps: [],
    lat: 23.2451,
    lng: 77.4102,
  },
  {
    rank: 3,
    slug: 'prempura-ghat',
    name_en: 'Prempura ghat',
    name_hi: 'प्रेमपुरा घाट',
    water_body: 'Upper Lake',
    score: 34.6,
    tier: 'medium',
    confidence: 'good',
    site_match_confidence: 'high',
    reasons: [
      {
        kind: 'worst_do',
        params: { value: 3.4, festival: 'Ganesh', year: 2024, phase: 'after', limit: 5 },
        reading_ids: [301],
      },
      {
        kind: 'bod_exceedance',
        params: { exceeded: 12, total: 18, max: 8.2 },
        reading_ids: [302],
      },
    ],
    suggested_actions: ['action_standard_cleaning', 'action_post_test'],
    known_gaps: [],
    lat: 23.2255,
    lng: 77.3754,
  },
  {
    rank: 4,
    slug: 'rani-kamlapati-ghat-kamla-park-kund',
    name_en: 'Rani Kamlapati ghat / Kamla Park kund',
    name_hi: 'रानी कमलापति घाट / कमला पार्क कुंड',
    water_body: 'Lower Lake',
    score: 28.5,
    tier: 'medium',
    confidence: 'limited',
    site_match_confidence: 'medium',
    reasons: [
      {
        kind: 'worst_do',
        params: { value: 4.0, festival: 'Durga', year: 2023, phase: 'during', limit: 5 },
        reading_ids: [401],
      },
      {
        kind: 'bod_exceedance',
        params: { exceeded: 10, total: 15, max: 7.8 },
        reading_ids: [402],
      },
    ],
    suggested_actions: ['action_standard_cleaning', 'action_baseline_test'],
    known_gaps: ['gap_site_name_variation'],
    lat: 23.2484,
    lng: 77.3995,
  },
  {
    rank: 5,
    slug: 'hathaikheda-dam-kund',
    name_en: 'Hathaikheda dam / kund',
    name_hi: 'हथाईखेड़ा बांध / कुंड',
    water_body: 'Hathaikheda dam',
    score: 14.2,
    tier: 'low',
    confidence: 'good',
    site_match_confidence: 'high',
    reasons: [
      {
        kind: 'bod_exceedance',
        params: { exceeded: 5, total: 18, max: 4.6 },
        reading_ids: [501],
      },
    ],
    suggested_actions: ['action_standard_cleaning'],
    known_gaps: [],
    lat: 23.2492,
    lng: 77.4781,
  },
  {
    rank: 6,
    slug: 'malikhedi-kund',
    name_en: 'Malikhedi kund',
    name_hi: 'मालीखेड़ी कुंड',
    water_body: 'Kund',
    score: 12.0,
    tier: 'low',
    confidence: 'limited',
    site_match_confidence: 'high',
    reasons: [
      {
        kind: 'bod_exceedance',
        params: { exceeded: 4, total: 12, max: 4.2 },
        reading_ids: [601],
      },
      {
        kind: 'data_gap',
        params: { sampled_count: 6 },
        reading_ids: [],
      },
    ],
    suggested_actions: ['action_standard_cleaning', 'action_baseline_test'],
    known_gaps: ['gap_no_durga_2025'],
    lat: 23.2621,
    lng: 77.4583,
  },
  {
    rank: 7,
    slug: 'shahpura-lake-ghat',
    name_en: 'Shahpura lake ghat',
    name_hi: 'शाहपुरा झील घाट',
    water_body: 'Shahpura Lake',
    score: 9.8,
    tier: 'low',
    confidence: 'good',
    site_match_confidence: 'high',
    reasons: [
      {
        kind: 'bod_exceedance',
        params: { exceeded: 3, total: 18, max: 3.8 },
        reading_ids: [701],
      },
    ],
    suggested_actions: ['action_standard_cleaning'],
    known_gaps: [],
    lat: 23.2081,
    lng: 77.4253,
  },
];

export const MOCK_READINGS_BY_ID: Record<number, Reading> = {
  101: {
    id: 101,
    reading_id: 101,
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
    site_as_printed: 'Sant Hirdaram Visarjankund, Bairagarh, Bhopal',
    source_page: 60,
  },
  102: {
    id: 102,
    reading_id: 102,
    site_slug: 'bairagarh-sant-hirdaram-kund',
    parameter: 'BOD',
    year: 2023,
    festival: 'Durga',
    phase: 'during',
    status: 'measured',
    value: 28.0,
    unit_assumed: 'mg/l',
    value_as_printed: '28.0',
    parameter_as_printed: 'B.O.D.',
    site_as_printed: 'Sant Hirdaram Visarjankund, Bairagarh, Bhopal',
    source_page: 60,
  },
  103: {
    id: 103,
    reading_id: 103,
    site_slug: 'bairagarh-sant-hirdaram-kund',
    parameter: 'BOD',
    year: 2024,
    festival: 'Ganesh',
    phase: 'after',
    status: 'measured',
    value: 22.4,
    unit_assumed: 'mg/l',
    value_as_printed: '22.4',
    parameter_as_printed: 'BOD',
    site_as_printed: 'Sant Hirdaram Visarjankund, Bairagarh',
    source_page: 44,
  },
  201: {
    id: 201,
    reading_id: 201,
    site_slug: 'khatlapura-ghat',
    parameter: 'Dissolved oxygen',
    year: 2024,
    festival: 'Durga',
    phase: 'during',
    status: 'measured',
    value: 1.8,
    unit_assumed: 'mg/l',
    value_as_printed: '1.8',
    parameter_as_printed: 'D.Oxygen',
    site_as_printed: 'Khatlapura Ghat, Lower Lake, Bhopal',
    source_page: 52,
  },
  202: {
    id: 202,
    reading_id: 202,
    site_slug: 'khatlapura-ghat',
    parameter: 'BOD',
    year: 2024,
    festival: 'Durga',
    phase: 'during',
    status: 'measured',
    value: 19.5,
    unit_assumed: 'mg/l',
    value_as_printed: '19.5',
    parameter_as_printed: 'BOD',
    site_as_printed: 'Khatlapura Ghat, Lower Lake, Bhopal',
    source_page: 52,
  },
  301: {
    id: 301,
    reading_id: 301,
    site_slug: 'prempura-ghat',
    parameter: 'Dissolved oxygen',
    year: 2024,
    festival: 'Ganesh',
    phase: 'after',
    status: 'measured',
    value: 3.4,
    unit_assumed: 'mg/l',
    value_as_printed: '3.4',
    parameter_as_printed: 'D.Oxygen',
    site_as_printed: 'Prempura Ghat, Upper Lake, Bhopal',
    source_page: 38,
  },
  302: {
    id: 302,
    reading_id: 302,
    site_slug: 'prempura-ghat',
    parameter: 'BOD',
    year: 2024,
    festival: 'Ganesh',
    phase: 'after',
    status: 'measured',
    value: 8.2,
    unit_assumed: 'mg/l',
    value_as_printed: '8.2',
    parameter_as_printed: 'BOD',
    site_as_printed: 'Prempura Ghat, Upper Lake, Bhopal',
    source_page: 38,
  },
  401: {
    id: 401,
    reading_id: 401,
    site_slug: 'rani-kamlapati-ghat-kamla-park-kund',
    parameter: 'Dissolved oxygen',
    year: 2023,
    festival: 'Durga',
    phase: 'during',
    status: 'measured',
    value: 4.0,
    unit_assumed: 'mg/l',
    value_as_printed: '4.0',
    parameter_as_printed: 'D.Oxygen',
    site_as_printed: 'Lower Lake Ghat, Bhopal',
    source_page: 61,
  },
  402: {
    id: 402,
    reading_id: 402,
    site_slug: 'rani-kamlapati-ghat-kamla-park-kund',
    parameter: 'BOD',
    year: 2023,
    festival: 'Durga',
    phase: 'during',
    status: 'measured',
    value: 7.8,
    unit_assumed: 'mg/l',
    value_as_printed: '7.8',
    parameter_as_printed: 'BOD',
    site_as_printed: 'Lower Lake Ghat, Bhopal',
    source_page: 61,
  },
  501: {
    id: 501,
    reading_id: 501,
    site_slug: 'hathaikheda-dam-kund',
    parameter: 'BOD',
    year: 2024,
    festival: 'Durga',
    phase: 'during',
    status: 'measured',
    value: 4.6,
    unit_assumed: 'mg/l',
    value_as_printed: '4.6',
    parameter_as_printed: 'BOD',
    site_as_printed: 'Hathaikheda Dam / Kund, Bhopal',
    source_page: 54,
  },
  601: {
    id: 601,
    reading_id: 601,
    site_slug: 'malikhedi-kund',
    parameter: 'BOD',
    year: 2024,
    festival: 'Ganesh',
    phase: 'during',
    status: 'measured',
    value: 4.2,
    unit_assumed: 'mg/l',
    value_as_printed: '4.2',
    parameter_as_printed: 'BOD',
    site_as_printed: 'Malikhedi Kund, Bhopal',
    source_page: 46,
  },
  701: {
    id: 701,
    reading_id: 701,
    site_slug: 'shahpura-lake-ghat',
    parameter: 'BOD',
    year: 2024,
    festival: 'Durga',
    phase: 'during',
    status: 'measured',
    value: 3.8,
    unit_assumed: 'mg/l',
    value_as_printed: '3.8',
    parameter_as_printed: 'BOD',
    site_as_printed: 'Shahpura Lake Ghat, Bhopal',
    source_page: 56,
  },
};

export function getMockGhatDetail(slug: string): GhatDetailResponse | null {
  const ghat = MOCK_GHATS.find((g) => g.slug === slug);
  if (!ghat) return null;

  // Build 3 years x 2 festivals x 3 phases coverage
  const years = [2023, 2024, 2025];
  const festivals: ('Ganesh' | 'Durga')[] = ['Ganesh', 'Durga'];
  const phases: ('pre' | 'during' | 'after')[] = ['pre', 'during', 'after'];

  const coverage: components['schemas']['CoverageCell'][] = [];

  for (const year of years) {
    for (const festival of festivals) {
      for (const phase of phases) {
        // Known gaps: Durga 2025 missing for Bairagarh and Malikhedi
        const isKnownMissing =
          (slug === 'bairagarh-sant-hirdaram-kund' || slug === 'malikhedi-kund') &&
          year === 2025 &&
          festival === 'Durga';

        if (isKnownMissing) {
          coverage.push({
            year,
            festival,
            phase,
            sampled: 0,
            missing: 13,
            status: 'not_sampled',
          });
        } else {
          coverage.push({
            year,
            festival,
            phase,
            sampled: 11,
            missing: 2,
            status: 'measured',
          });
        }
      }
    }
  }

  return {
    ghat,
    coverage,
    reasons: ghat.reasons,
    known_gaps: ghat.known_gaps,
    suggested_actions: ghat.suggested_actions,
  };
}

export function getMockReadings(slug: string): Reading[] {
  // Generate sample readings across parameters for this ghat
  const parameters = [
    { name: 'Dissolved oxygen', unit: 'mg/l', base: slug.includes('bairagarh') ? 2.0 : 5.8 },
    { name: 'BOD', unit: 'mg/l', base: slug.includes('bairagarh') ? 14.0 : 4.5 },
    { name: 'pH', unit: null, base: 7.6 },
    { name: 'COD', unit: 'mg/l', base: 45.0 },
    { name: 'Turbidity', unit: 'NTU', base: 18.0 },
    { name: 'Total solids', unit: 'mg/l', base: 420.0 },
    { name: 'Dissolved solids', unit: 'mg/l', base: 310.0 },
    { name: 'Suspended solids', unit: 'mg/l', base: 110.0 },
    { name: 'Conductivity', unit: 'µS/cm', base: 480.0 },
    { name: 'Lead', unit: 'mg/l', base: null, status: 'bdl' as const },
    { name: 'Copper', unit: 'mg/l', base: null, status: 'bdl' as const },
    { name: 'Zinc', unit: 'mg/l', base: null, status: 'bdl' as const },
    { name: 'Chromium', unit: 'mg/l', base: null, status: 'not_sampled' as const },
  ];

  const readings: Reading[] = [];
  let id = 1000;

  const years = [2023, 2024, 2025];
  const festivals: ('Ganesh' | 'Durga')[] = ['Ganesh', 'Durga'];
  const phases: ('pre' | 'during' | 'after')[] = ['pre', 'during', 'after'];

  for (const year of years) {
    for (const festival of festivals) {
      for (const phase of phases) {
        const isDurga2025Missing =
          (slug === 'bairagarh-sant-hirdaram-kund' || slug === 'malikhedi-kund') &&
          year === 2025 &&
          festival === 'Durga';

        for (const p of parameters) {
          id++;
          if (isDurga2025Missing) {
            readings.push({
              id,
              reading_id: id,
              site_slug: slug,
              parameter: p.name,
              year,
              festival,
              phase,
              status: 'not_sampled',
              value: null,
              unit_assumed: p.unit,
              value_as_printed: 'not sampled',
              parameter_as_printed: p.name,
              site_as_printed: slug,
              source_page: 28,
            });
          } else if (p.status === 'bdl') {
            readings.push({
              id,
              reading_id: id,
              site_slug: slug,
              parameter: p.name,
              year,
              festival,
              phase,
              status: 'bdl',
              value: null,
              unit_assumed: p.unit,
              value_as_printed: 'BDL',
              parameter_as_printed: p.name,
              site_as_printed: slug,
              source_page: year === 2023 ? 60 : year === 2024 ? 44 : 28,
            });
          } else if (p.status === 'not_sampled') {
            readings.push({
              id,
              reading_id: id,
              site_slug: slug,
              parameter: p.name,
              year,
              festival,
              phase,
              status: 'not_sampled',
              value: null,
              unit_assumed: p.unit,
              value_as_printed: '-',
              parameter_as_printed: p.name,
              site_as_printed: slug,
              source_page: year === 2023 ? 60 : year === 2024 ? 44 : 28,
            });
          } else {
            // Calculated variation for realism
            const mult = phase === 'during' ? 1.4 : phase === 'after' ? 1.2 : 0.9;
            const val = p.base !== null ? Math.round(p.base * mult * 10) / 10 : null;
            readings.push({
              id,
              reading_id: id,
              site_slug: slug,
              parameter: p.name,
              year,
              festival,
              phase,
              status: 'measured',
              value: val,
              unit_assumed: p.unit,
              value_as_printed: String(val),
              parameter_as_printed: p.name,
              site_as_printed: slug,
              source_page: year === 2023 ? 60 : year === 2024 ? 44 : 28,
            });
          }
        }
      }
    }
  }

  // Prepend curated reason readings if they match this slug
  for (const r of Object.values(MOCK_READINGS_BY_ID)) {
    if (r.site_slug === slug) {
      readings.unshift(r);
    }
  }

  return readings;
}

export const MOCK_LIMITS: LimitsResponse = {
  cpcb_class: 'B',
  limits: [
    {
      parameter: 'Dissolved oxygen',
      limit_type: 'min',
      limit_min: 5.0,
      limit_max: null,
      unit: 'mg/l',
      best_use: 'Outdoor bathing (organised)',
    },
    {
      parameter: 'BOD',
      limit_type: 'max',
      limit_min: null,
      limit_max: 3.0,
      unit: 'mg/l',
      best_use: 'Outdoor bathing (organised)',
    },
    {
      parameter: 'pH',
      limit_type: 'range',
      limit_min: 6.5,
      limit_max: 8.5,
      unit: null,
      best_use: 'Outdoor bathing (organised)',
    },
  ],
};

export const MOCK_PARAMETERS: ParametersResponse = {
  parameters: [
    { name: 'Dissolved oxygen', unit: 'mg/l', is_scored: true, label_key: 'parameter.do' },
    { name: 'BOD', unit: 'mg/l', is_scored: true, label_key: 'parameter.bod' },
    { name: 'pH', unit: null, is_scored: true, label_key: 'parameter.ph' },
    { name: 'COD', unit: 'mg/l', is_scored: false, label_key: 'parameter.cod' },
    { name: 'Total solids', unit: 'mg/l', is_scored: false, label_key: 'parameter.total_solids' },
    { name: 'Dissolved solids', unit: 'mg/l', is_scored: false, label_key: 'parameter.dissolved_solids' },
    { name: 'Suspended solids', unit: 'mg/l', is_scored: false, label_key: 'parameter.suspended_solids' },
    { name: 'Turbidity', unit: 'NTU', is_scored: false, label_key: 'parameter.turbidity' },
    { name: 'Conductivity', unit: 'µS/cm', is_scored: false, label_key: 'parameter.conductivity' },
    { name: 'Lead', unit: 'mg/l', is_scored: false, label_key: 'parameter.lead' },
    { name: 'Copper', unit: 'mg/l', is_scored: false, label_key: 'parameter.copper' },
    { name: 'Zinc', unit: 'mg/l', is_scored: false, label_key: 'parameter.zinc' },
    { name: 'Chromium', unit: 'mg/l', is_scored: false, label_key: 'parameter.chromium' },
  ],
};

export const MOCK_BRIEF: BriefResponse = {
  brief_id: 1,
  scoring_run_id: 1,
  created_at: '2026-10-11T12:00:00Z',
  source: 'template',
  model: null,
  en: {
    headline: 'High-risk visarjan sites require immediate aeration and waste clearance.',
    top_risks: [
      'Bairagarh (Sant Hirdaram) kund: recorded dissolved oxygen of 0 mg/l during Durga 2023 immersion (bathing limit: 5 mg/l).',
      'Khatlapura ghat: recorded dissolved oxygen of 1.8 mg/l during Durga 2024 immersion and BOD peak of 19.5 mg/l.',
      'Prempura ghat: dissolved oxygen fell to 3.4 mg/l after Ganesh 2024 immersion with BOD of 8.2 mg/l.',
    ],
    actions: [
      'Deploy water aeration equipment at Bairagarh and Khatlapura ghats before and during immersion.',
      'Station continuous waste and flower removal teams at all Upper and Lower Lake immersion points.',
      'Request MPPCB for intensive post-visarjan water quality testing (1–2 days after 20 October).',
    ],
    data_gaps: [
      'No Durga 2025 immersion test data was published for Bairagarh and Malikhedi kunds.',
      'Rani Kamlapati site reflects potential sampling location variation between festivals.',
    ],
    source_line: 'Source: MPPCB idol immersion monitoring reports 2023–2025, verified against CPCB Class B bathing standards.',
  },
  hi: {
    headline: 'उच्च जोखिम वाले विसर्जन स्थलों पर तत्काल वातन एवं अपशिष्ट निष्कासन आवश्यक है।',
    top_risks: [
      'बैरागढ़ (संत हिरदाराम) कुंड: दुर्गा 2023 विसर्जन के दौरान घुलित ऑक्सीजन 0 मि.ग्रा./ली. दर्ज (स्नान सीमा: 5 मि.ग्रा./ली.)।',
      'खटलापुरा घाट: दुर्गा 2024 विसर्जन के दौरान घुलित ऑक्सीजन 1.8 मि.ग्रा./ली. तथा बीओडी 19.5 मि.ग्रा./ली. दर्ज।',
      'प्रेमपुरा घाट: गणेश 2024 विसर्जन पश्चात घुलित ऑक्सीजन 3.4 मि.ग्रा./ली. और बीओडी 8.2 मि.ग्रा./ली. रही।',
    ],
    actions: [
      'विसर्जन से पूर्व एवं दौरान बैरागढ़ व खटलापुरा घाटों पर जल वातन (एरेटर) संयंत्र स्थापित करें।',
      'बड़ा तालाब एवं छोटा तालाब के विसर्जन स्थलों पर निरंतर तैरता कचरा व फूल-माला हटाने वाली टीमें तैनात करें।',
      '20 अक्टूबर के 1-2 दिन बाद म.प्र.प्र.नि.बो. से अतिरिक्त सघन जल परीक्षण का अनुरोध करें।',
    ],
    data_gaps: [
      'बैरागढ़ और मालीखेड़ी कुंड हेतु दुर्गा 2025 विसर्जन का परीक्षण डेटा रिपोर्ट में प्रकाशित नहीं है।',
      'रानी कमलापति स्थल के नाम में उत्सवों के बीच संभावित स्थल भिन्नता दर्ज है।',
    ],
    source_line: 'स्रोत: म.प्र. प्रदूषण नियंत्रण बोर्ड विसर्जन रिपोर्ट 2023–2025, सीपीसीबी वर्ग बी मानकों से सत्यापित।',
  },
  validation: {
    ok: true,
    word_count_en: 118,
    word_count_hi: 122,
  },
};
