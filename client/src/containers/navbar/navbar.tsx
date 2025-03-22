import { Link, NavLink, useNavigate } from 'react-router';
import React, { use } from 'react';
import AppBar from '@mui/material/AppBar';
import { AuthContext } from '../../context';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Cookies from 'js-cookie';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { PATHS } from '../../routing';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import WcIcon from '@mui/icons-material/Wc';
import styled from '@emotion/styled';

const pages = [
  {
    name: 'Home',
    url: PATHS.LANDING_PAGE,
  },
  {
    name: 'Admin',
    url: PATHS.ADMIN_PAGE,
  },
  {
    name: 'User Answers',
    url: PATHS.USER_ANSWERS_PAGE,
  },
  {
    name: 'Features',
    url: PATHS.FEATURES_PAGE,
  },
];

const LogoLink = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  color: 'white',
});

export const Navbar = () => {
  const navigate = useNavigate();
  const auth = use(AuthContext);
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogOut = () => {
    auth?.setAuthUser(null);
    Cookies.remove('jwttoken', { path: '/' });
    navigate(PATHS.LOGIN_PAGE);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <LogoLink to={PATHS.LANDING_PAGE}>
            <WcIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="span"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              E&M
            </Typography>
          </LogoLink>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page, idx) => (
                <MenuItem key={idx} onClick={handleCloseNavMenu}>
                  <Typography sx={{ textAlign: 'center' }}>
                    <Link to={page.url}>{page.name}</Link>
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <WcIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="span"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <LogoLink to={PATHS.LANDING_PAGE}>E&M</LogoLink>
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page, idx) => (
              <Button
                onClick={handleCloseNavMenu}
                sx={{
                  my: 2,
                  color: 'white',
                  display: 'block',
                }}
              >
                <NavLink to={page.url} key={idx} end>
                  {({ isActive }) => (
                    <Typography
                      sx={{
                        fontSize: '14px',
                        fontWeight: isActive ? 700 : 400,

                        '&:hover': {
                          fontWeight: isActive ? 700 : 500,
                        },
                      }}
                    >
                      {page.name}
                    </Typography>
                  )}
                </NavLink>
              </Button>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Admin" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={handleLogOut}>
                <Typography sx={{ textAlign: 'center' }}>Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
