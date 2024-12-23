import { queryOptions } from '@tanstack/solid-query';
import { discGolfMetrixGetCompetitionThrows } from '~/apiWrapper/getCompetitionThrows';
import { discGolfMetrixGetMapboxAccessToken } from '~/apiWrapper/getMapboxAccessToken';

export function getMapboxAccessTokenQueryOptions() {
  return queryOptions({
    queryKey: ['mapbox access token'],
    queryFn: async () => {
      const result = await discGolfMetrixGetMapboxAccessToken();
      return result;
    },
    throwOnError: true,
  });
}

export function getCompetitionThrowsQueryOptions(competitionId: string) {
  return queryOptions({
    queryKey: ['competition throws', competitionId],
    queryFn: async () => {
      const result = await discGolfMetrixGetCompetitionThrows(competitionId);
      return result;
    },
    throwOnError: true,
  });
}
