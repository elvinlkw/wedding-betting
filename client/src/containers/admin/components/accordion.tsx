import { Question, useDeleteQuestion } from '../../../api/services/question';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import MuiAccordion from '@mui/material/Accordion';
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
  onDeleteClick?: (question: Question) => void;
}) => {
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(
    null
  );

  const { mutateAsync: deleteQuestion } = useDeleteQuestion();

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

  return (
    <>
      <div>
        {data.map((question) => (
          <MuiAccordion defaultExpanded key={`question-${question.questionId}`}>
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
        open={!!questionToDelete}
        onClose={() => setQuestionToDelete(null)}
      >
        <DialogTitle>Deleting "{questionToDelete?.questionText}"</DialogTitle>
        <DialogContent>
          <DialogContentText>
            All choices associated with the question will be deleted too. This
            action cannot be reversed.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQuestionToDelete(null)}>Cancel</Button>
          <Button onClick={handleDelete} autoFocus variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
