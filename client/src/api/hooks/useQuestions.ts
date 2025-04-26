import questionsService, { GameQuestion } from '../services/questions.service';
import { useQuery } from '@tanstack/react-query';

export const useGameQuestions = ({
  revealedOnly = false,
}: {
  revealedOnly?: boolean;
} = {}) => {
  return useQuery<GameQuestion[]>({
    queryKey: [revealedOnly ? 'gameQuestions' : 'revealedGameQuestions'],
    queryFn: () => questionsService.getGameQuestions(revealedOnly),
  });
};
