import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import {
  FEATURE_SHOW_LOGIN_ICON_NAVBAR,
  FEATURE_SHOW_SEARING_CHART,
} from '../../features';
import { FormattedMessage } from 'react-intl';
import GamesIcon from '@mui/icons-material/Games';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import LoginIcon from '@mui/icons-material/Login';
import Paper from '@mui/material/Paper';
import SettingsIcon from '@mui/icons-material/Settings';
import { useFeatureFlag } from '../../hooks/useFeatureFlag.hooks';
import FlatwareIcon from '@mui/icons-material/Flatware';

const navigationLinks = [
  {
    path: '/',
    label: <FormattedMessage id="navbar.title.game" />,
    icon: <GamesIcon />,
  },
  {
    path: '/leaderboard',
    label: <FormattedMessage id="navbar.title.leaderboard" />,
    icon: <LeaderboardIcon />,
  },
  {
    path: '/settings',
    label: <FormattedMessage id="navbar.title.settings" />,
    icon: <SettingsIcon />,
  },
];

export const BottomNavbar = () => {
  const [value, setValue] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const showLoginIcon = useFeatureFlag(FEATURE_SHOW_LOGIN_ICON_NAVBAR);
  const showSeatingChart = useFeatureFlag(FEATURE_SHOW_SEARING_CHART);

  const navlinks = useMemo(() => {
    return [
      ...navigationLinks,
      ...(showSeatingChart
        ? [
            {
              path: '/seating-chart',
              label: <FormattedMessage id="navbar.title.seating" />,
              icon: <FlatwareIcon />,
            },
          ]
        : []),
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
  }, [showLoginIcon, showSeatingChart]);

  useEffect(() => {
    const currentIndex = navlinks.findIndex((link) => {
      const [, mainPath] = location.pathname.split('/');
      return link.path === `/${mainPath}`;
    });
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
