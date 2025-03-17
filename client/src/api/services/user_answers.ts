import { useQuery, UseQueryResult } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import axios from 'axios';

type Answer = {
  questionId: number;
  questionText: string;
  choiceId: number;
  choiceText: string;
  isRightAnswer: boolean;
};

type UserAnswer = {
  userId: number;
  firstName: string;
  lastName: string;
  answers: Answer[];
};

const getUserAnswers = async (): Promise<UserAnswer[]> => {
  const config = {
    headers: {
      'x-auth-token': Cookies.get('jwttoken'),
    },
  };
  const response = await axios.get('/api/user-answers', config);
  return response.data.data;
};

export const useUserAnswers = (): UseQueryResult<UserAnswer[]> => {
  return useQuery<UserAnswer[]>({
    queryKey: ['user-answers'],
    queryFn: getUserAnswers,
  });
};
