import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from './client';
import type { components } from './schema';

type RankingResponse = components['schemas']['RankingResponse'];
type GhatDetailResponse = components['schemas']['GhatDetailResponse'];
type Reading = components['schemas']['Reading'];
type LimitsResponse = components['schemas']['LimitsResponse'];
type ParametersResponse = components['schemas']['ParametersResponse'];
type BriefResponse = components['schemas']['BriefResponse'];

export const useRanking = (cpcbClass = 'B') =>
  useQuery<RankingResponse>({
    queryKey: ['ranking', cpcbClass],
    queryFn: () => api.get<RankingResponse>(`/api/ranking?cpcb_class=${cpcbClass}`),
    staleTime: 1000 * 60 * 5,
  });

export const useGhat = (slug: string, cpcbClass = 'B') =>
  useQuery<GhatDetailResponse>({
    queryKey: ['ghat', slug, cpcbClass],
    queryFn: () => api.get<GhatDetailResponse>(`/api/ghats/${slug}?cpcb_class=${cpcbClass}`),
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 5,
  });

export const useReadings = (slug: string, filters?: { parameter?: string; year?: number }) =>
  useQuery<Reading[]>({
    queryKey: ['readings', slug, filters],
    queryFn: () => {
      const params = new URLSearchParams();
      if (filters?.parameter) params.set('parameter', filters.parameter);
      if (filters?.year) params.set('year', String(filters.year));
      const queryString = params.toString() ? `?${params.toString()}` : '';
      return api.get<Reading[]>(`/api/ghats/${slug}/readings${queryString}`);
    },
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 5,
  });

export const useReading = (readingId: number | null) =>
  useQuery<Reading>({
    queryKey: ['reading', readingId],
    queryFn: () => api.get<Reading>(`/api/readings/${readingId}`),
    enabled: readingId !== null && readingId > 0,
    staleTime: 1000 * 60 * 10,
  });

export const useLimits = (cpcbClass = 'B') =>
  useQuery<LimitsResponse>({
    queryKey: ['limits', cpcbClass],
    queryFn: () => api.get<LimitsResponse>(`/api/limits?cpcb_class=${cpcbClass}`),
    staleTime: 1000 * 60 * 30,
  });

export const useParameters = () =>
  useQuery<ParametersResponse>({
    queryKey: ['parameters'],
    queryFn: () => api.get<ParametersResponse>('/api/parameters'),
    staleTime: 1000 * 60 * 30,
  });

export const useCreateBrief = () =>
  useMutation<BriefResponse, Error, string>({
    mutationFn: (cpcbClass: string) =>
      api.post<BriefResponse>('/api/briefs', { cpcb_class: cpcbClass }),
  });

export const useBrief = (briefId: number | null) =>
  useQuery<BriefResponse>({
    queryKey: ['brief', briefId],
    queryFn: () => api.get<BriefResponse>(`/api/briefs/${briefId}`),
    enabled: briefId !== null && briefId > 0,
  });
