import { Typography } from '@mui/material';
import { GameQuestion } from '../../api/services/questions.service';
import { Header } from '../../components';
import { NameField } from './components/nameField';
import { NavigationButton } from './components/navigationButtons';
import { QuestionItem } from './components/questionItem';
import styled from '@emotion/styled';
import { useState } from 'react';
import theme from '../../theme';

const Form = styled.form({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

type BettingGameContainerProps = {
  gameQuestions: GameQuestion[];
};

type FormValues = {
  firstName: string;
  lastName: string;
  answers: Array<{
    questionId: number;
    choiceId: number | null;
  }>;
};

export const BettingGameContainer = ({
  gameQuestions,
}: BettingGameContainerProps) => {
  const [pageState, setPageState] = useState(0);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);
  const [formValues, setFormValues] = useState<FormValues>({
    firstName: '',
    lastName: '',
    answers: gameQuestions.map((qu) => ({
      questionId: qu.questionId,
      choiceId: null,
    })),
  });

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [event.target.name]: event.target.value,
    }));
    if (formError) {
      setFormError(null);
    }
  };

  const handleSubmit = () => {
    if (!formValues.firstName || !formValues.lastName) {
      setFormError('Please provide your name');
      return;
    }

    if (formValues.answers.some((ans) => ans.choiceId === null)) {
      setFormError('Please answer all questions');
      return;
    }

    try {
      setIsSubmitSuccessful(true);
    } catch (err) {
      console.error(err);
    }
  };

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

      {isSubmitSuccessful ? (
        <Typography
          align="center"
          fontSize="24px"
          sx={{ py: theme.space.space7 }}
        >
          Thank you for participating.
          <br />
          Your answer has been successfully registered. <br />
          Enjoy the rest of the day!
        </Typography>
      ) : (
        <Form>
          {pageState < gameQuestions.length ? (
            <QuestionItem
              question={gameQuestions[pageState]}
              selectedChoice={formValues.answers[pageState].choiceId}
              onChoiceClick={(choiceId) => {
                setFormValues((prevValues) => {
                  const answers = [...prevValues.answers];
                  answers[pageState].choiceId = choiceId;

                  return {
                    ...prevValues,
                    answers,
                  };
                });
                if (formError) {
                  setFormError(null);
                }
              }}
            />
          ) : (
            <NameField
              firstName={formValues.firstName}
              lastName={formValues.lastName}
              onNameChange={handleNameChange}
              formError={formError}
            />
          )}

          <NavigationButton
            totalCount={gameQuestions.length}
            currentPage={pageState}
            onSubmit={handleSubmit}
            onPreviousClick={() =>
              setPageState((prev) => Math.max(0, prev - 1))
            }
            onNextClick={() =>
              setPageState((prev) => Math.min(gameQuestions.length, prev + 1))
            }
            formError={formError}
          />
        </Form>
      )}
    </div>
  );
};
