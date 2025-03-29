import apiClient from '../interceptors';

type UserScoreboard = {
  userId: number;
  firstName: string;
  lastName: string;
  correctAnswers: number;
  percentCorrect: number;
};

export type LeaderboardResponse = {
  totalQuestions: number;
  questionsRevealed: number;
  userScoreboard: UserScoreboard[];
};

class Leaderboard {
  async getLeaderboard(): Promise<LeaderboardResponse> {
    const response = await apiClient.get('/api/scoreboard');
    return response.data;
  }
}

export default new Leaderboard();
