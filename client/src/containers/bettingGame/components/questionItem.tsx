import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { GameQuestion } from '../../../api/services/questions.service';
import Stack from '@mui/material/Stack';
import theme from '../../../theme';

type QuestionItemProps = {
  question: GameQuestion;
  selectedChoice: number | null;
  onChoiceClick: (choiceId: number) => void;
};

export const QuestionItem = ({
  question,
  selectedChoice,
  onChoiceClick,
}: QuestionItemProps) => {
  return (
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <FormControl
        key={question.questionId}
        sx={{ gap: theme.space.space4, width: '100%' }}
      >
        <FormLabel
          id="demo-radio-buttons-group-label"
          sx={{
            fontSize: theme.space.space5,
            mt: theme.space.space6,
            color: '#68604D',
            textAlign: 'center',
          }}
        >
          {question.questionText}
        </FormLabel>
        <Stack
          aria-labelledby="demo-radio-buttons-group-label"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.space.space4,
            width: '100%',
          }}
        >
          {question.choices.map((choice) => (
            <Chip
              key={choice.choiceId}
              sx={{
                width: '100%',
                height: theme.space.space6,
                fontSize: '16px',
              }}
              color="primary"
              label={choice.choiceText}
              variant={
                selectedChoice === choice.choiceId ? 'filled' : 'outlined'
              }
              onClick={() => {
                onChoiceClick(choice.choiceId);
              }}
            />
          ))}
        </Stack>
      </FormControl>
    </Container>
  );
};
