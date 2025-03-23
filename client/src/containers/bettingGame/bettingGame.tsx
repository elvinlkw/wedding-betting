import { GameQuestion } from '../../api/services/questions.service';
import { Header } from '../../components';
import { QuestionItem } from './components/questionItem';
import styled from '@emotion/styled';

const Form = styled.form({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

type BettingGameContainerProps = {
  gameQuestions: GameQuestion[];
};

export const BettingGameContainer = ({
  gameQuestions,
}: BettingGameContainerProps) => {
  return (
    <div>
      <Header
        title={
          <>
            Elvin & Mary's <br /> Wedding Betting
          </>
        }
        content="Happy Guessing! Good luck!"
      />

      <Form>
        <QuestionItem question={gameQuestions[0]} />
      </Form>
    </div>
  );
};
