import {
  Question,
  useDeleteQuestion,
  usePatchQuestion,
} from '../../../api/services/question';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import DeleteIcon from '@mui/icons-material/Delete';
import { Dialog } from '../../../components';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import MuiAccordion from '@mui/material/Accordion';
import PublicIcon from '@mui/icons-material/Public';
import PublicOffIcon from '@mui/icons-material/PublicOff';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import { Tooltip } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

export const Accordion = ({
  data,
  onEditClick,
}: {
  data: Question[];
  onEditClick?: (
    event: React.MouseEvent<HTMLButtonElement>,
    question: Question
  ) => void;
}) => {
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(
    null
  );
  const [showSnackbar, setShowSnackbar] = useState<Question | null>(null);
  const [showReveal, setShowReveal] = useState<Question | null>(null);

  const { mutateAsync: deleteQuestion } = useDeleteQuestion();
  const { mutateAsync: patchQuestion } = usePatchQuestion();

  const handleDelete = async () => {
    if (!questionToDelete) {
      return;
    }

    try {
      await deleteQuestion(questionToDelete?.questionId);
      setQuestionToDelete(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReveal = async () => {
    if (!showReveal) return;

    await patchQuestion({
      questionId: showReveal.questionId,
      isAnswerRevealed: !showReveal.isAnswerRevealed,
    });
    setShowSnackbar(showReveal);
    setShowReveal(null);
  };

  return (
    <>
      <div>
        {data.map((question) => (
          <MuiAccordion
            defaultExpanded
            key={`question-${question.questionId}`}
            sx={{
              backgroundColor: question.isAnswerRevealed
                ? 'rgba(144,238,144,0.3)'
                : 'inherit',
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography component="span">{question.questionText}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',

                  '& > .cta-container': {
                    opacity: {
                      xs: 1,
                      sm: 0,
                    },
                    transition: ' opacity 0.2s ease-in-out',
                  },

                  '&:hover > .cta-container': {
                    opacity: 1,
                  },
                }}
              >
                <Stack direction="row" gap={1} flexWrap="wrap">
                  {question.choices.map((choice) => (
                    <Chip
                      key={choice.choiceId}
                      label={choice.choiceText}
                      color={choice.isRightAnswer ? 'success' : 'error'}
                    />
                  ))}
                </Stack>
                <Box
                  sx={{
                    display: 'flex',
                    gap: '4px',
                  }}
                  className="cta-container"
                >
                  <Tooltip
                    title={
                      question.isAnswerRevealed
                        ? 'Make Answer Public'
                        : 'Make Answer Hidden'
                    }
                  >
                    <IconButton
                      aria-label="Edit Button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setShowReveal(question);
                      }}
                    >
                      {question.isAnswerRevealed ? (
                        <PublicIcon />
                      ) : (
                        <PublicOffIcon />
                      )}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton
                      aria-label="Edit Button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onEditClick?.(event, question);
                      }}
                    >
                      <ModeEditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      color="error"
                      aria-label="Delete Button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setQuestionToDelete(question);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </AccordionDetails>
          </MuiAccordion>
        ))}
      </div>

      <Dialog
        onCancel={() => setQuestionToDelete(null)}
        onConfirm={handleDelete}
        visible={!!questionToDelete}
        content={{
          title: `Deleting "${questionToDelete?.questionText}"`,
          content: `All choices associated with the question will be deleted too. This
            action cannot be reversed.`,
          confirmText: 'Delete',
        }}
      />

      <Dialog
        onCancel={() => setShowReveal(null)}
        onConfirm={handleReveal}
        visible={!!showReveal}
        content={{
          title: `Reveal answer for "${showReveal?.questionText}"`,
          content: `This will make the answer for this question public for viewing`,
          confirmText: 'Confirm',
        }}
      />

      <Snackbar
        open={!!showSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowSnackbar(null)}
        message={
          <div>
            <Typography sx={{ fontSize: '16px' }}>
              Answer for this question is now public!
            </Typography>
            <Typography sx={{ fontSize: '12px' }}>
              "{showSnackbar?.questionText}"
            </Typography>
            <Typography sx={{ fontSize: '12px' }}>
              Answer: "
              {
                showSnackbar?.choices?.find((choice) => choice.isRightAnswer)
                  ?.choiceText
              }
              "
            </Typography>
          </div>
        }
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      />
    </>
  );
};
