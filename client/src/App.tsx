import {
  AdminPage,
  BettingGamePage,
  FeaturesPage,
  LeaderboardPage,
  LoginPage,
  UserAnswers,
} from './pages';
import { Outlet, Route, Routes, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { AuthContext } from './context';
import { type AuthUser } from './types/auth';

import { BottomNavbar } from './containers/bottomNavbar/bottomNavbar';
import { IntlProvider } from 'react-intl';
import { LanguageSelection } from './pages/languageSelection';
import { Navbar } from './containers';
import { PATHS } from './routing';
import { ProtectedRoute } from './routing';
import { Spinner } from './components';

import frMessages from './i18n/locales/fr.json';
import { useFeatureStore } from './store/featureStore';
import { useFeatures } from './api';
import { useLanguageStore } from './store/languageStore';

// import enMessages from './i18n/locales/en.json';

function App() {
  const { setFeatures } = useFeatureStore();
  const { language, setLanguage } = useLanguageStore();
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  const gameLanguage = localStorage.getItem('gameLanguage') as 'en' | 'fr';

  const { data: featuresData, isLoading } = useFeatures();

  useEffect(() => {
    if (!gameLanguage) {
      navigate('/language-selection');
      return;
    }

    setLanguage(gameLanguage);
  }, [gameLanguage, navigate, setLanguage]);

  useEffect(() => {
    if (featuresData) {
      setFeatures(featuresData);
    }
  }, [featuresData, setFeatures]);

  if (isLoading) {
    return <Spinner />;
  }

  console.log(language);

  return (
    <IntlProvider
      locale={language}
      messages={language === 'fr' ? frMessages : undefined}
      defaultLocale="fr"
    >
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
          <Route path="language-selection" element={<LanguageSelection />} />

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
    </IntlProvider>
  );
}

export default App;
