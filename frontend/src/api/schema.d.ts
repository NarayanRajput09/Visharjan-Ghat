/**
 * API types for Visarjan Ghat Watch
 * Matches OpenAPI schema from FastAPI backend
 */

export interface paths {
  '/api/health': {
    get: {
      responses: {
        200: {
          content: {
            'application/json': components['schemas']['HealthResponse'];
          };
        };
      };
    };
  };
  '/api/ranking': {
    get: {
      parameters: {
        query?: {
          cpcb_class?: components['schemas']['CPCBClass'];
        };
      };
      responses: {
        200: {
          content: {
            'application/json': components['schemas']['RankingResponse'];
          };
        };
      };
    };
  };
  '/api/ghats/{slug}': {
    get: {
      parameters: {
        path: {
          slug: string;
        };
        query?: {
          cpcb_class?: components['schemas']['CPCBClass'];
        };
      };
      responses: {
        200: {
          content: {
            'application/json': components['schemas']['GhatDetailResponse'];
          };
        };
        404: {
          content: {
            'application/json': components['schemas']['AppError'];
          };
        };
      };
    };
  };
  '/api/ghats/{slug}/readings': {
    get: {
      parameters: {
        path: {
          slug: string;
        };
        query?: {
          parameter?: string;
          year?: number;
          festival?: 'Ganesh' | 'Durga';
          phase?: 'pre' | 'during' | 'after';
          status?: components['schemas']['ReadingStatus'];
        };
      };
      responses: {
        200: {
          content: {
            'application/json': components['schemas']['Reading'][];
          };
        };
      };
    };
  };
  '/api/readings/{reading_id}': {
    get: {
      parameters: {
        path: {
          reading_id: number;
        };
      };
      responses: {
        200: {
          content: {
            'application/json': components['schemas']['Reading'];
          };
        };
      };
    };
  };
  '/api/limits': {
    get: {
      parameters: {
        query?: {
          cpcb_class?: components['schemas']['CPCBClass'];
        };
      };
      responses: {
        200: {
          content: {
            'application/json': components['schemas']['LimitsResponse'];
          };
        };
      };
    };
  };
  '/api/parameters': {
    get: {
      responses: {
        200: {
          content: {
            'application/json': components['schemas']['ParametersResponse'];
          };
        };
      };
    };
  };
  '/api/briefs': {
    post: {
      requestBody: {
        content: {
          'application/json': components['schemas']['CreateBriefRequest'];
        };
      };
      responses: {
        200: {
          content: {
            'application/json': components['schemas']['BriefResponse'];
          };
        };
      };
    };
  };
  '/api/briefs/{brief_id}': {
    get: {
      parameters: {
        path: {
          brief_id: number;
        };
      };
      responses: {
        200: {
          content: {
            'application/json': components['schemas']['BriefResponse'];
          };
        };
      };
    };
  };
}

export interface components {
  schemas: {
    CPCBClass: 'A' | 'B' | 'C' | 'D' | 'E';
    Tier: 'high' | 'medium' | 'low';
    Confidence: 'good' | 'limited' | 'poor';
    SiteMatchConfidence: 'high' | 'medium';
    ReadingStatus: 'measured' | 'bdl' | 'nd' | 'not_sampled';
    Phase: 'pre' | 'during' | 'after';
    Festival: 'Ganesh' | 'Durga';

    HealthResponse: {
      ok: boolean;
      data_hash: string;
      scoring_config_version: string;
      llm_available: boolean;
    };

    Reason: {
      kind: 'worst_do' | 'bod_exceedance' | 'trend' | 'ph_out_of_range' | 'data_gap';
      params: Record<string, string | number>;
      reading_ids: number[];
    };

    RankedGhat: {
      rank: number;
      slug: string;
      name_en: string;
      name_hi: string;
      water_body: string;
      score: number;
      tier: components['schemas']['Tier'];
      confidence: components['schemas']['Confidence'];
      site_match_confidence: components['schemas']['SiteMatchConfidence'];
      reasons: components['schemas']['Reason'][];
      suggested_actions: string[];
      known_gaps: string[];
      lat?: number | null;
      lng?: number | null;
    };

    RankingResponse: {
      scoring_run_id: number;
      generated_at: string;
      cpcb_class: components['schemas']['CPCBClass'];
      ghats: components['schemas']['RankedGhat'][];
    };

    CoverageCell: {
      year: number;
      festival: components['schemas']['Festival'];
      phase: components['schemas']['Phase'];
      sampled: number;
      missing: number;
      status?: components['schemas']['ReadingStatus'];
    };

    GhatDetailResponse: {
      ghat: components['schemas']['RankedGhat'];
      coverage: components['schemas']['CoverageCell'][];
      reasons: components['schemas']['Reason'][];
      known_gaps: string[];
      suggested_actions: string[];
    };

    Reading: {
      id: number;
      reading_id: number;
      site_slug: string;
      site_id?: number;
      parameter: string;
      parameter_id?: number;
      year: number;
      festival: components['schemas']['Festival'];
      phase: components['schemas']['Phase'];
      status: components['schemas']['ReadingStatus'];
      value: number | null;
      unit_assumed: string | null;
      flag_raw?: string | null;
      value_as_printed: string | null;
      parameter_as_printed: string | null;
      site_as_printed: string;
      source_page: number;
      report_url?: string;
    };

    LimitItem: {
      parameter: string;
      limit_type: 'min' | 'max' | 'range';
      limit_min: number | null;
      limit_max: number | null;
      unit: string | null;
      best_use: string;
    };

    LimitsResponse: {
      cpcb_class: components['schemas']['CPCBClass'];
      limits: components['schemas']['LimitItem'][];
    };

    ParameterInfo: {
      name: string;
      unit: string | null;
      is_scored: boolean;
      label_key: string;
    };

    ParametersResponse: {
      parameters: components['schemas']['ParameterInfo'][];
    };

    BriefSection: {
      headline: string;
      top_risks: string[];
      actions: string[];
      data_gaps: string[];
      source_line: string;
    };

    BriefValidation: {
      ok: boolean;
      errors?: string[];
      word_count_en?: number;
      word_count_hi?: number;
    };

    CreateBriefRequest: {
      cpcb_class: string;
    };

    BriefResponse: {
      brief_id: number;
      scoring_run_id?: number;
      created_at?: string;
      source: 'claude' | 'template';
      model?: string | null;
      en: components['schemas']['BriefSection'];
      hi: components['schemas']['BriefSection'];
      validation: components['schemas']['BriefValidation'];
    };

    AppError: {
      error: {
        code: string;
        message: string;
      };
    };
  };
}
