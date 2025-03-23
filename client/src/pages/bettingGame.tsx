import { BettingGame } from '../containers';
import { Spinner } from '../components';
import { Typography } from '@mui/material';
import { useGameQuestions } from '../api/hooks/useQuestions';

export const BettingGamePage = () => {
  const { data, isLoading } = useGameQuestions();

  if (isLoading) {
    return <Spinner />;
  }

  if (!data) {
    return <Typography>No Questions Found</Typography>;
  }

  return <BettingGame gameQuestions={data} />;
};
