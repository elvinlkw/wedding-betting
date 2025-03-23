import {
  AdminPage,
  BettingGamePage,
  FeaturesPage,
  LeaderboardPage,
  LoginPage,
  UserAnswers,
} from './pages';
import { Outlet, Route, Routes } from 'react-router';
import { useEffect, useState } from 'react';
import { AuthContext } from './context';
import { type AuthUser } from './types/auth';

import { BottomNavbar } from './containers/bottomNavbar/bottomNavbar';
import { Navbar } from './containers';
import { PATHS } from './routing';
import { ProtectedRoute } from './routing';
import { Spinner } from './components';

import { useFeatureStore } from './store/featureStore';
import { useFeatures } from './api';

function App() {
  const { setFeatures } = useFeatureStore();
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  const { data: featuresData, isLoading } = useFeatures();

  useEffect(() => {
    if (featuresData) {
      setFeatures(featuresData);
    }
  }, [featuresData, setFeatures]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Outlet />
              <BottomNavbar />
            </>
          }
        >
          <Route index element={<BettingGamePage />} />
          <Route path="leaderboard" element={<LeaderboardPage />} />
          <Route path="login" element={<LoginPage />} />
        </Route>

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
          <Route
            path="features"
            element={
              <ProtectedRoute>
                <FeaturesPage />
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
