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
  const handleOpen = () => setOpen(true);

  return (
    <>
      <Container maxWidth="xl">
        <Typography component="h2" fontSize={24} align="center">
          List of Questions
        </Typography>
        <ActionBar onAddQuestionClick={handleOpen} />
        <Accordion data={data} />
      </Container>
      <Modal open={open} setOpen={setOpen} />
    </>
  );
};
