import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useQuestions } from './api/services/question';

import Table from './table.component';

const queryClient = new QueryClient();

const Page = () => {
  const { isLoading, data } = useQuestions();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No data</div>;
  }

  return <Table data={data} />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Page />
    </QueryClientProvider>
  );
}

export default App;
