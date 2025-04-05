import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import { PATHS } from '../../routing';
import Person2Icon from '@mui/icons-material/Person2';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

const navigationLinks = [
  {
    path: PATHS.LANDING_PAGE,
    label: 'Home',
    icon: <HomeOutlinedIcon />,
  },
  {
    path: PATHS.ADMIN_PAGE,
    label: 'Questions',
    icon: <QuestionMarkIcon />,
  },
  {
    path: PATHS.USER_ANSWERS_PAGE,
    label: 'Submissions',
    icon: <QuestionAnswerIcon />,
  },
  {
    path: PATHS.DIRECTORY_PAGE,
    label: 'Directory',
    icon: <Person2Icon />,
  },
  {
    path: PATHS.FEATURES_PAGE,
    label: 'Features',
    icon: <NewReleasesIcon />,
  },
];

export const AdminBottomNavbar = () => {
  const [value, setValue] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const currentIndex = navigationLinks.findIndex(
      (link) => link.path === location.pathname
    );
    setValue(currentIndex !== -1 ? currentIndex : 0);
  }, [location]);

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
          navigate(navigationLinks[newValue].path);
        }}
      >
        {navigationLinks.map((link, idx) => (
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
