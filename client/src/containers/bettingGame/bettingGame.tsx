import { Chip, Container, Stack, Typography } from '@mui/material';
import { FEATURE_PLAY_GAME } from '../../features';
import { GameQuestion } from '../../api/services/questions.service';
import { Header } from '../../components';
import { NameField } from './components/nameField';
import { NavigationButton } from './components/navigationButtons';
import { QuestionItem } from './components/questionItem';
import styled from '@emotion/styled';
import theme from '../../theme';
import { useCreateUserAnswer } from '../../api/hooks/useUserAnswers';
import { useFeatureFlag } from '../../hooks';
import { useState } from 'react';

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

  const canPlayGame = useFeatureFlag(FEATURE_PLAY_GAME);

  const { mutateAsync: createUserAnswer } = useCreateUserAnswer();

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [event.target.name]: event.target.value,
    }));
    if (formError) {
      setFormError(null);
    }
  };

  const handleSubmit = async () => {
    if (!formValues.firstName || !formValues.lastName) {
      setFormError('Please provide your name');
      return;
    }

    if (formValues.answers.some((ans) => ans.choiceId === null)) {
      setFormError('Please answer all questions');
      return;
    }

    try {
      await createUserAnswer(formValues);
      setIsSubmitSuccessful(true);
    } catch (err) {
      console.error(err);
    }
  };

  if (!canPlayGame) {
    return (
      <div>
        <Header
          title="Sorry"
          content="The game is now closed! Go and enjoy the party!"
        />
        <Container
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Typography>
            The host of the today's game has now ended the wedding betting game.
          </Typography>
        </Container>
      </div>
    );
  }

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
          <Container>
            <Stack
              direction="row"
              sx={{
                mt: 1,
                display: 'flex',
                gap: '8px',
                justifyContent: 'center',
              }}
            >
              {gameQuestions.map((qu, idx) => {
                const hasChoice =
                  formValues.answers[idx].choiceId !== null
                    ? 'primary'
                    : 'default';

                return (
                  <Chip
                    onClick={() => {
                      setPageState(idx);
                    }}
                    sx={{
                      border: pageState === idx ? '1px solid' : 'none',
                      borderColor:
                        pageState === idx
                          ? theme.palette.primary.main
                          : 'transparent',
                      transform: pageState === idx ? 'scale(1.1)' : 'none',
                      borderRadius: '50%',
                    }}
                    label={idx + 1}
                    color={hasChoice}
                    variant="filled"
                  />
                );
              })}
              <Chip
                onClick={() => {
                  setPageState(gameQuestions.length);
                }}
                sx={{
                  border:
                    pageState === gameQuestions.length ? '1px solid' : 'none',
                  borderColor:
                    pageState === gameQuestions.length
                      ? theme.palette.primary.main
                      : 'transparent',
                  transform:
                    pageState === gameQuestions.length ? 'scale(1.1)' : 'none',
                  borderRadius: '50%',
                }}
                label={gameQuestions.length + 1}
                color={
                  formValues.firstName.length && formValues.lastName.length
                    ? 'primary'
                    : 'default'
                }
                variant="filled"
              />
            </Stack>
          </Container>
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
