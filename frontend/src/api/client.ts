import {
  MOCK_GHATS,
  MOCK_LIMITS,
  MOCK_PARAMETERS,
  MOCK_BRIEF,
  MOCK_READINGS_BY_ID,
  getMockGhatDetail,
  getMockReadings,
} from './mockData';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }

      return (await response.json()) as T;
    } catch (err) {
      // If network fails (backend offline/mock mode), provide valid mock fallback
      console.warn(`[API] Fallback to local mock data for ${endpoint}:`, err);
      const mockResult = this.getFallback<T>(endpoint, options);
      if (mockResult !== undefined) {
        return mockResult;
      }
      throw err;
    }
  }

  private getFallback<T>(endpoint: string, options?: RequestInit): T | undefined {
    // GET /api/ranking
    if (endpoint.startsWith('/api/ranking')) {
      const urlParams = new URLSearchParams(endpoint.split('?')[1] ?? '');
      const cpcbClass = (urlParams.get('cpcb_class') ?? 'B') as 'A' | 'B' | 'C' | 'D' | 'E';
      return {
        scoring_run_id: 1,
        generated_at: new Date().toISOString(),
        cpcb_class: cpcbClass,
        ghats: MOCK_GHATS,
      } as unknown as T;
    }

    // GET /api/ghats/{slug}/readings
    if (endpoint.includes('/readings') && endpoint.startsWith('/api/ghats/')) {
      const parts = endpoint.split('/');
      const slug = parts[3]?.split('?')[0] ?? '';
      return getMockReadings(slug) as unknown as T;
    }

    // GET /api/ghats/{slug}
    if (endpoint.startsWith('/api/ghats/')) {
      const parts = endpoint.split('/');
      const slug = parts[3]?.split('?')[0] ?? '';
      const detail = getMockGhatDetail(slug);
      if (detail) return detail as unknown as T;
    }

    // GET /api/readings/{id}
    if (endpoint.startsWith('/api/readings/')) {
      const id = Number(endpoint.split('/')[3]);
      const reading = MOCK_READINGS_BY_ID[id];
      if (reading) return reading as unknown as T;
    }

    // GET /api/limits
    if (endpoint.startsWith('/api/limits')) {
      return MOCK_LIMITS as unknown as T;
    }

    // GET /api/parameters
    if (endpoint.startsWith('/api/parameters')) {
      return MOCK_PARAMETERS as unknown as T;
    }

    // POST /api/briefs
    if (endpoint === '/api/briefs' && options?.method === 'POST') {
      return MOCK_BRIEF as unknown as T;
    }

    // GET /api/briefs/{id}
    if (endpoint.startsWith('/api/briefs/')) {
      return MOCK_BRIEF as unknown as T;
    }

    return undefined;
  }

  public get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  public post<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  public getReportPdfUrl(year: number, page: number): string {
    return `${BASE_URL}/reports/${year}.pdf#page=${page}`;
  }

  public getExportCsvUrl(cpcbClass = 'B'): string {
    return `${BASE_URL}/api/export/ranking.csv?cpcb_class=${cpcbClass}`;
  }
}

export const api = new ApiClient();
