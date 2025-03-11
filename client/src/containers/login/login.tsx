import { Button, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { type LoginRequest, useAuthLogin } from '../../api/auth';
import { object, string } from 'yup';
import { AuthContext } from '../../context';
import Cookies from 'js-cookie';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { use } from 'react';
import { useNavigate } from 'react-router';
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
  const { control, setError, handleSubmit, setFocus } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  const { mutate } = useAuthLogin();

  const auth = use(AuthContext);

  const submit = (data: LoginRequest) => {
    mutate(data, {
      onSuccess: (response) => {
        console.log('Login successful:', response);
        // Handle successful login, e.g., store token, redirect, etc.
        auth?.setAuthUser({
          id: response.id,
        });
        Cookies.set('jwttoken', response.token);
        navigate('/page');
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
          <TextField
            {...field}
            sx={formFieldCss}
            type="text"
            label="Username"
            error={!!fieldState.error}
            variant="standard"
            helperText={fieldState.error?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            sx={formFieldCss}
            type="password"
            label="Password"
            error={!!fieldState.error}
            variant="standard"
            helperText={fieldState.error?.message}
          />
        )}
      />

      <Button type="submit" sx={formFieldCss} variant="contained">
        Login
      </Button>
    </Form>
  );
};
