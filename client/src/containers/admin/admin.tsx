import { Accordion } from './components/accordion';
import { Container } from '@mui/material';
import { Question } from '../../api/services/question';

type AdminContainerProps = {
  data: Question[];
};

export const AdminContainer = ({ data }: AdminContainerProps) => {
  return (
    <Container maxWidth="xl">
      adminContainer
      <Accordion data={data} />
    </Container>
  );
};
