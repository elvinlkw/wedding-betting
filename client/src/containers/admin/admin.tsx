import { Accordion } from './components/accordion';
import { ActionBar } from './components/actionBar';
import { Container } from '@mui/material';
import { Question } from '../../api/services/question';

type AdminContainerProps = {
  data: Question[];
};

export const AdminContainer = ({ data }: AdminContainerProps) => {
  return (
    <Container maxWidth="xl">
      <ActionBar />
      <Accordion data={data} />
    </Container>
  );
};
