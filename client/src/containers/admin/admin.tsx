import { Accordion } from './components/accordion';
import { ActionBar } from './components/actionBar';
import Container from '@mui/material/Container';
import { Modal } from './components/modal';
import { Question } from '../../api/services/question';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

type AdminContainerProps = {
  data: Question[];
};

export const AdminContainer = ({ data }: AdminContainerProps) => {
  const [open, setOpen] = useState(false);
  const [focusedQuestion, setFocusedQuestion] = useState<Question | null>(null);
  const handleOpen = () => setOpen(true);

  const handleEditClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    _question: Question
  ) => {
    event.preventDefault();
    setFocusedQuestion(_question);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    if (focusedQuestion) {
      setFocusedQuestion(null);
    }
  };

  return (
    <>
      <Container maxWidth="xl">
        <Typography component="h2" fontSize={24} align="center">
          List of Questions
        </Typography>
        <ActionBar onAddQuestionClick={handleOpen} />
        <Accordion data={data} onEditClick={handleEditClick} />
      </Container>
      <Modal open={open} question={focusedQuestion} onClose={handleClose} />
    </>
  );
};
