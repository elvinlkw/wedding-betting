import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { FEATURE_SHOW_LOGIN_ICON_NAVBAR } from '../../features';
import GamesIcon from '@mui/icons-material/Games';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import LoginIcon from '@mui/icons-material/Login';
import Paper from '@mui/material/Paper';
import { useFeatureFlag } from '../../hooks/useFeatureFlag.hooks';

const navigationLinks = [
  { path: '/', label: 'Game', icon: <GamesIcon /> },
  { path: '/leaderboard', label: 'Leaderboard', icon: <LeaderboardIcon /> },
];

export const BottomNavbar = () => {
  const [value, setValue] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const showLoginIcon = useFeatureFlag(FEATURE_SHOW_LOGIN_ICON_NAVBAR);

  const navlinks = useMemo(() => {
    return [
      ...navigationLinks,
      ...(showLoginIcon
        ? [
            {
              path: '/login',
              label: 'Login',
              icon: <LoginIcon />,
            },
          ]
        : []),
    ];
  }, [showLoginIcon]);

  useEffect(() => {
    const currentIndex = navlinks.findIndex(
      (link) => link.path === location.pathname
    );
    setValue(currentIndex !== -1 ? currentIndex : 0);
  }, [location, navlinks]);

  return (
    <Paper
      sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1 }}
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(_event, newValue) => {
          setValue(newValue);
          navigate(navlinks[newValue].path);
        }}
      >
        {navlinks.map((link, idx) => (
          <BottomNavigationAction
            key={idx}
            label={link.label}
            icon={link.icon}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
};
