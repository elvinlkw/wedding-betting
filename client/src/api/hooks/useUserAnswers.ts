import { UseQueryResult, useMutation, useQuery } from '@tanstack/react-query';
import { UserAnswer } from '../services/userAnswers.service';
import userAnswersService from '../services/userAnswers.service';

export const useUserAnswers = (): UseQueryResult<UserAnswer[]> => {
  return useQuery<UserAnswer[]>({
    queryKey: ['user-answers'],
    queryFn: userAnswersService.getUserAnswers,
  });
};

export const useCreateUserAnswer = () => {
  return useMutation({
    mutationFn: userAnswersService.createUserAnswer,
  });
};
