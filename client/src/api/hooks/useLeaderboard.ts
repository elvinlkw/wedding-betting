import { UseQueryResult, useQuery } from '@tanstack/react-query';
import leaderboardService, {
  LeaderboardResponse,
} from '../services/leaderboard.service';

export const useLeaderboard = (): UseQueryResult<LeaderboardResponse> => {
  return useQuery<LeaderboardResponse>({
    queryKey: ['leaderboard'],
    queryFn: leaderboardService.getLeaderboard,
  });
};
