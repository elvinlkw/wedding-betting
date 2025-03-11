import { Controller, useForm } from 'react-hook-form';
import { object, string } from 'yup';
import { TextField as MuiTextField } from '@mui/material';
import styled from '@emotion/styled';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = object({
  username: string().required('Username is required'),
  password: string().required('Password is required'),
});

const Form = styled.form({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  width: '100%',
  padding: '0 16px',
  boxSizing: 'border-box',
});

const TextField = styled(MuiTextField)({
  width: '400px',

  '@media (max-width: 600px)': {
    width: '100%',
  },
});

export const Login = () => {
  const { control, handleSubmit } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  return (
    <Form onSubmit={handleSubmit((data) => console.log(data))}>
      <Controller
        control={control}
        name="username"
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            type="text"
            required
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
            type="password"
            required
            label="Password"
            error={!!fieldState.error}
            variant="standard"
            helperText={fieldState.error?.message}
          />
        )}
      />
    </Form>
  );
};
