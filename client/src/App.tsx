import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Routes } from 'react-router';

import { AuthContext } from './context';
import { type AuthUser } from './types/auth';
import { Login } from './pages';
import { ProtectedRoute } from './routing';
import Table from './table.component';

import { useQuestions } from './api/services/question';
import { useState } from 'react';

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
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ authUser, setAuthUser }}>
        <Routes>
          <Route index element={<div>Home</div>} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/page"
            element={
              <ProtectedRoute user={authUser}>
                <Page />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<div>404 Page Not Found</div>} />
        </Routes>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
