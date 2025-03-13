import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import MuiAccordion from '@mui/material/Accordion';
import { Question } from '../../../api/services/question';
import Stack from '@mui/material/Stack';
import { Tooltip } from '@mui/material';
import Typography from '@mui/material/Typography';
import styled from '@emotion/styled';

const CustomChip = styled(Chip)({
  position: 'relative',

  '& .MuiSvgIcon-root': {
    opacity: 1,
    position: 'absolute',
    right: -10,
    top: -10,
    background: 'inherit',
    borderRadius: '50%',
    transition: 'opacity 0.3s ease',
  },

  '&:hover .MuiSvgIcon-root': {
    opacity: 1,
  },

  '@media (min-width: 600px)': {
    '& .MuiSvgIcon-root': {
      opacity: 0,
    },
  },
});

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
  return (
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
                  <CustomChip
                    key={choice.choiceId}
                    label={choice.choiceText}
                    color={choice.isRightAnswer ? 'success' : 'error'}
                    onDelete={() => {}} // TODO: Add Delete Logic
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
                    onClick={(e) => e.stopPropagation()}
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
  );
};
