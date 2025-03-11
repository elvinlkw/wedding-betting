import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Chip from '@mui/material/Chip';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MuiAccordion from '@mui/material/Accordion';
import { Question } from '../../../api/services/question';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import styled from '@emotion/styled';

const CustomChip = styled(Chip)({
  position: 'relative',

  '& .MuiSvgIcon-root': {
    opacity: 0,
    position: 'absolute',
    right: -10,
    top: -10,
    background: 'inherit',
    borderRadius: '50%',
  },
  '&:hover .MuiSvgIcon-root': {
    transform: 'translateX(0)',
    opacity: 1,
  },
});

export const Accordion = ({ data }: { data: Question[] }) => {
  return (
    <div>
      <Typography component="h2" fontSize={24} align="center">
        List of Questions
      </Typography>
      {data.map((question) => (
        <MuiAccordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography component="span">{question.questionText}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack direction="row" spacing={1}>
              {question.choices.map((choice) => (
                <CustomChip
                  key={choice.choiceId}
                  label={choice.choiceText}
                  color={choice.isRightAnswer ? 'success' : 'error'}
                  onDelete={() => {}} // TODO: Add Delete Logic
                />
              ))}
            </Stack>
          </AccordionDetails>
        </MuiAccordion>
      ))}
    </div>
  );
};
