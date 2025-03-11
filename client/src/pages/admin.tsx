import { Admin } from '../containers';

import { useQuestions } from '../api/services/question';

export const AdminPage = () => {
  const { isLoading, data } = useQuestions();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No data</div>;
  }

  return <Admin data={data} />;
};
