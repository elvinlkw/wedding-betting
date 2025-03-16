import { AdminPage, LoginPage, UserAnswers } from './pages';
import { NavLink, Outlet, Route, Routes } from 'react-router';
import { AuthContext } from './context';

import { type AuthUser } from './types/auth';
import { Navbar } from './containers';
import { PATHS } from './routing';
import { ProtectedRoute } from './routing';

import { useState } from 'react';

function App() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      <Routes>
        <Route
          index
          element={
            <div>
              <div>
                <NavLink to="/admin">Admin</NavLink>
              </div>
            </div>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        {/* ADMIN ROUTES */}
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
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="user-answers"
            element={
              <ProtectedRoute>
                <UserAnswers />
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
