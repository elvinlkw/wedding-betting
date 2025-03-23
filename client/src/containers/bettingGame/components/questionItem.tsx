import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { GameQuestion } from '../../../api/services/questions.service';
import Stack from '@mui/material/Stack';
import theme from '../../../theme';
import { useScreenOrientation } from '../../../hooks';
import { useState } from 'react';

type QuestionItemProps = {
  question: GameQuestion;
  onPreviousClick?: () => void;
  onNextClick?: () => void;
  totalCount: number;
  currentPage: number;
};

export const QuestionItem = ({
  question,
  currentPage,
  totalCount,
  onPreviousClick,
  onNextClick,
}: QuestionItemProps) => {
  const [selected, setSelected] = useState<number>(-1);
  const orientation = useScreenOrientation();

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
          sx={
            orientation === 'portrait'
              ? {
                  position: 'fixed',
                  left: 0,
                  right: 0,
                  bottom: '56px',
                  pb: theme.space.space4,
                }
              : undefined
          }
        >
          <Container
            maxWidth="sm"
            sx={{
              mt: theme.space.space4,
              pb:
                orientation === 'landscape'
                  ? theme.space.space8
                  : theme.space.space0,
            }}
          >
            <Stack
              direction="column"
              justifyContent="space-between"
              gap={theme.space.space2}
            >
              <Button
                disabled={currentPage === 0}
                variant="outlined"
                onClick={onPreviousClick}
              >
                Previous
              </Button>
              <Button
                disabled={selected === -1 || currentPage === totalCount - 1}
                variant="contained"
                onClick={onNextClick}
              >
                Next
              </Button>
            </Stack>
          </Container>
        </Box>
      </FormControl>
    </Container>
  );
};
