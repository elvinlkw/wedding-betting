import { GameQuestion } from '../../api/services/questions.service';
import { Header } from '../../components';
import { QuestionItem } from './components/questionItem';
import styled from '@emotion/styled';
import { useState } from 'react';

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
  const [pageState, setPageState] = useState(0);

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
        <QuestionItem
          question={gameQuestions[pageState]}
          totalCount={gameQuestions.length}
          currentPage={pageState}
          onPreviousClick={() => setPageState((prev) => Math.max(0, prev - 1))}
          onNextClick={() =>
            setPageState((prev) => Math.min(gameQuestions.length - 1, prev + 1))
          }
        />
      </Form>
    </div>
  );
};
