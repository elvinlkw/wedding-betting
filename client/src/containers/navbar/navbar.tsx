import { Button, Stack } from '@mui/material';
import { NavLink, useNavigate } from 'react-router';
import Cookies from 'js-cookie';
import { PATHS } from '../../routing';
import styled from '@emotion/styled';

const NavContainer = styled.div({
  backgroundColor: '#161616',
  boxSizing: 'border-box',
  padding: '12px',
  width: '100svw',
  margin: '0 auto',
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '16px',
});

export const Navbar = () => {
  const navigate = useNavigate();

  const handleLogOut = () => {
    Cookies.remove('jwttoken', { path: '/' });
    navigate(PATHS.LANDING_PAGE);
  };

  return (
    <NavContainer>
      <Stack spacing={2} direction="row">
        <NavLink to={PATHS.LANDING_PAGE}>
          {({ isActive }) => (
            <Button variant={isActive ? 'contained' : 'outlined'}>Home</Button>
          )}
        </NavLink>
        <NavLink to={PATHS.ADMIN_PAGE}>
          {({ isActive }) => (
            <Button variant={isActive ? 'contained' : 'outlined'}>Admin</Button>
          )}
        </NavLink>

        <Button onClick={handleLogOut} variant={'outlined'}>
          Log out
        </Button>
      </Stack>
    </NavContainer>
  );
};
