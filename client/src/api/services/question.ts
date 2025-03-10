import { UseQueryResult, useQuery } from '@tanstack/react-query';
import axios from 'axios';

type Choice = {
  choiceId: number;
  choiceText: string;
};

export type Question = {
  questionId: number;
  questionText: string;
  choices: Choice[];
};

const getQuestions = async (): Promise<Question[]> => {
  const response = await axios.get('/api/questions?includeChoices=true');
  return response.data.data;
};

export const useQuestions = (): UseQueryResult<Question[]> => {
  return useQuery<Question[]>({
    queryKey: ['questions'],
    queryFn: getQuestions,
  });
};
