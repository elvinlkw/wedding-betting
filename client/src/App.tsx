import { NavLink, Outlet, Route, Routes } from 'react-router';
import { AuthContext } from './context';

import { type AuthUser } from './types/auth';
import { Login } from './pages';
import { Navbar } from './containers';
import { PATHS } from './routing';
import { ProtectedRoute } from './routing';
import Table from './table.component';

import { useQuestions } from './api/services/question';
import { useState } from 'react';

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
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      <Routes>
        <Route
          index
          element={
            <div>
              {authUser?.id}
              <div>
                <NavLink to="/admin">Admin</NavLink>
              </div>
            </div>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route
          path={PATHS.ADMIN_PAGE}
          element={
            <>
              <Navbar />
              <Outlet />
            </>
          }
        >
          <Route
            index
            element={
              <ProtectedRoute>
                <Page />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="*" element={<div>404 Page Not Found</div>} />
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;
