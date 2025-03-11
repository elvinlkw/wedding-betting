import { UseQueryResult, useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import axios from 'axios';

type Choice = {
  choiceId: number;
  choiceText: string;
  isRightAnswer: boolean;
};

export type Question = {
  questionId: number;
  questionText: string;
  choices: Choice[];
};

const getQuestionsForAdmins = async (): Promise<Question[]> => {
  const config = {
    headers: {
      'x-auth-token': Cookies.get('jwttoken'),
    },
  };
  const response = await axios.get('/api/questions/admin', config);
  return response.data.data;
};

export const useQuestions = (): UseQueryResult<Question[]> => {
  return useQuery<Question[]>({
    queryKey: ['admin-questions'],
    queryFn: getQuestionsForAdmins,
  });
};
