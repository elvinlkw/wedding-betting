import axios from 'axios';

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
    const response = await axios.get('/api/scoreboard');
    return response.data;
  }
}

export default new Leaderboard();
