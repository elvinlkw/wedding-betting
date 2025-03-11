import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Stack,
  Typography,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { type LoginRequest, useAuthLogin } from '../../api/auth';
import { object, string } from 'yup';
import { use, useEffect, useState } from 'react';
import { AuthContext } from '../../context';
import Cookies from 'js-cookie';
import { PATHS } from '../../routing';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = object({
  username: string().required('Username is required'),
  password: string().required('Password is required'),
});

const Form = styled.form({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  width: '100%',
  padding: '0 16px',
  boxSizing: 'border-box',
});

const formFieldCss = css({
  width: '100%',

  '@media (min-width: 600px)': {
    width: '400px',
  },
});

export const Login = () => {
  const navigate = useNavigate();
  const auth = use(AuthContext);

  const [showPassword, setShowPassword] = useState(false);

  const { control, setError, handleSubmit, setFocus } = useForm({
    mode: 'onBlur',
    defaultValues: {
      username: '',
      password: '',
    },
    resolver: yupResolver(schema),
  });

  const { mutate } = useAuthLogin();

  useEffect(() => {
    if (Cookies.get('jwttoken')) {
      navigate(PATHS.ADMIN_PAGE);
    }
  }, [auth?.authUser, navigate]);

  const submit = (data: LoginRequest) => {
    mutate(data, {
      onSuccess: (response) => {
        console.log('Login successful:', response);
        auth?.setAuthUser({
          id: response.id,
        });
        Cookies.set('jwttoken', response.token);
        navigate(PATHS.ADMIN_PAGE);
      },
      onError: (err) => {
        console.error(err);
        setError('username', {
          message: 'Invalid Credentials',
        });
        setError('password', {
          message: 'Invalid Credentials',
        });
        setFocus('username');
      },
    });
  };

  return (
    <Form onSubmit={handleSubmit(submit)}>
      <Controller
        control={control}
        name="username"
        render={({ field, fieldState }) => (
          <Box
            sx={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'flex-start',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <FormControl sx={formFieldCss} variant="standard">
              <InputLabel
                htmlFor="username"
                sx={{
                  color: fieldState.error
                    ? 'rgb(211, 47, 47)'
                    : 'rgba(0, 0, 0, 0.6)',
                }}
              >
                Username
              </InputLabel>
              <Input
                {...field}
                id="username"
                type={'text'}
                error={!!fieldState.error}
              />
            </FormControl>
            {fieldState.error && (
              <Typography
                sx={css(
                  { ...formFieldCss },
                  { fontSize: 14, color: 'rgb(211, 47, 47)' }
                )}
              >
                {fieldState.error?.message}
              </Typography>
            )}
          </Box>
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field, fieldState }) => (
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              flexDirection: 'column',
            }}
          >
            <FormControl sx={formFieldCss} variant="standard">
              <InputLabel
                htmlFor="password"
                sx={{
                  color: fieldState.error
                    ? 'rgb(211, 47, 47)'
                    : 'rgba(0, 0, 0, 0.6)',
                }}
              >
                Password
              </InputLabel>

              <Input
                {...field}
                id="password"
                type={showPassword ? 'text' : 'password'}
                error={!!fieldState.error}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword
                          ? 'hide the password'
                          : 'display the password'
                      }
                      onClick={() => setShowPassword((pw) => !pw)}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <Typography
              sx={css(
                { ...formFieldCss },
                { fontSize: 14, color: 'rgb(211, 47, 47)' }
              )}
            >
              {fieldState.error?.message}
            </Typography>
          </Box>
        )}
      />

      <Stack
        sx={css(
          {
            ...formFieldCss,
          },
          { gap: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr' }
        )}
        direction="row"
      >
        <Link to="/" style={{ width: '100%' }}>
          <Button sx={{ width: '100%' }} variant="contained" color="inherit">
            Back to Main
          </Button>
        </Link>
        <Button type="submit" variant="contained">
          Login
        </Button>
      </Stack>
    </Form>
  );
};
