import { NavLink, Route, Routes } from 'react-router';
import { useEffect, useState } from 'react';

import { AuthContext } from './context';
import { type AuthUser } from './types/auth';
import { Login } from './pages';
import { ProtectedRoute } from './routing';
import { Spinner } from './components/spinner/spinner';
import Table from './table.component';

import { useAuth } from './api/auth';
import { useQuestions } from './api/services/question';

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
  const { data, isLoading } = useAuth();
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    if (data) {
      setAuthUser(data);
    }
  }, [data]);

  if (isLoading || !authUser) {
    return <Spinner />;
  }

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      <Routes>
        <Route
          index
          element={
            <div>
              {authUser?.id}
              <div>
                <NavLink to="/page">Page</NavLink>
              </div>
            </div>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/page"
          element={
            <ProtectedRoute>
              <Page />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<div>404 Page Not Found</div>} />
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;
