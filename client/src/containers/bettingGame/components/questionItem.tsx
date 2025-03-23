import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { GameQuestion } from '../../../api/services/questions.service';
import Stack from '@mui/material/Stack';
import theme from '../../../theme';
import { useState } from 'react';

type QuestionItemProps = {
  question: GameQuestion;
};

export const QuestionItem = ({ question }: QuestionItemProps) => {
  const [selected, setSelected] = useState<number>(-1);

  return (
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <FormControl key={question.questionId} sx={{ gap: '16px' }}>
        <FormLabel
          id="demo-radio-buttons-group-label"
          sx={{ fontSize: '24px', mt: '32px', color: '#68604D' }}
        >
          {question.questionText}
        </FormLabel>
        <Stack
          aria-labelledby="demo-radio-buttons-group-label"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            width: '100%',
          }}
        >
          {question.choices.map((choice) => (
            <Chip
              key={choice.choiceId}
              sx={{
                width: '100%',
                height: '36px',
                fontSize: '16px',
                borderColor: theme.palette.sage.light,
                color:
                  selected === choice.choiceId
                    ? theme.palette.sage.contrastText
                    : '#68604D',
                background:
                  selected === choice.choiceId
                    ? theme.palette.sage.main
                    : 'inherit',

                ':hover': {
                  background: theme.palette.sage.main,
                },
              }}
              label={choice.choiceText}
              variant={selected === choice.choiceId ? 'filled' : 'outlined'}
              onClick={() => {
                setSelected(choice.choiceId);
              }}
            />
          ))}
        </Stack>

        <Box
          sx={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: '56px',
            pb: '16px',
          }}
        >
          <Container maxWidth="sm" sx={{ mt: '16px' }}>
            <Stack direction="column" justifyContent="space-between" gap="8px">
              <Button variant="outlined">Previous</Button>
              <Button disabled={selected === -1} variant="contained">
                Next
              </Button>
            </Stack>
          </Container>
        </Box>
      </FormControl>
    </Container>
  );
};
