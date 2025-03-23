import questionsService, { GameQuestion } from '../services/questions.service';
import { useQuery } from '@tanstack/react-query';

export const useGameQuestions = () => {
  return useQuery<GameQuestion[]>({
    queryKey: ['gameQuestions'],
    queryFn: questionsService.getGameQuestions,
  });
};
