import Cookies from 'js-cookie';
import apiClient from '../interceptors';

type Answer = {
  questionId: number;
  questionText: string;
  choiceId: number;
  choiceText: string;
  isRightAnswer: boolean;
};

export type UserAnswer = {
  userId: number;
  firstName: string;
  lastName: string;
  answers: Answer[];
};

type CreateUserAnswerBody = {
  firstName: string;
  lastName: string;
  answers: Array<{
    questionId: number;
    choiceId: number | null;
  }>;
};

class UserAnswers {
  async getUserAnswers(): Promise<UserAnswer[]> {
    const config = {
      headers: {
        'x-auth-token': Cookies.get('jwttoken'),
      },
    };
    const response = await apiClient.get('/api/user-answers', config);
    return response.data.data;
  }

  async createUserAnswer(data: CreateUserAnswerBody) {
    const response = await apiClient.post('/api/user-answers', data);
    return response.data;
  }
}

export default new UserAnswers();
