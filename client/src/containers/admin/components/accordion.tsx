import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Chip from '@mui/material/Chip';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MuiAccordion from '@mui/material/Accordion';
import { Question } from '../../../api/services/question';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

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
                <Chip
                  key={choice.choiceId}
                  label={choice.choiceText}
                  color={choice.isRightAnswer ? 'success' : 'error'}
                />
              ))}
            </Stack>
          </AccordionDetails>
        </MuiAccordion>
      ))}
    </div>
  );
};
