import { Container, Typography } from '@mui/material';
import { Accordion } from './components/accordion';
import { ActionBar } from './components/actionBar';
import { Question } from '../../api/services/question';

type AdminContainerProps = {
  data: Question[];
};

export const AdminContainer = ({ data }: AdminContainerProps) => {
  return (
    <Container maxWidth="xl">
      <Typography component="h2" fontSize={24} align="center">
        List of Questions
      </Typography>
      <ActionBar />
      <Accordion data={data} />
    </Container>
  );
};
