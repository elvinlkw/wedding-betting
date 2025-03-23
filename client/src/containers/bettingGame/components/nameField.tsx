import { Container, TextField, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import theme from '../../../theme';

type NameFieldProps = {
  firstName: string;
  lastName: string;
  formError: string | null;
  onNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const NameField = ({
  firstName,
  lastName,
  onNameChange,
  formError,
}: NameFieldProps) => {
  const [validationErrors, setValidationErrors] = useState<{
    firstName?: string;
    lastName?: string;
  }>({});

  useEffect(() => {
    if (formError) {
      setValidationErrors({
        ...(firstName.length === 0
          ? { firstName: 'This is a required field' }
          : {}),
        ...(lastName.length === 0
          ? { lastName: 'This is a required field' }
          : {}),
      });
      return;
    }

    setValidationErrors({});
  }, [formError, firstName, lastName]);

  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement>): void => {
      if (event.target.value.length === 0) {
        setValidationErrors({
          ...validationErrors,
          [event.target.name]: `This is a required field`,
        });
      }
    },
    [validationErrors]
  );

  const handleFocus = useCallback(
    (event: React.FocusEvent<HTMLInputElement>): void => {
      const targetName = event.target.name as keyof typeof validationErrors;
      if (validationErrors[targetName]) {
        const newErrors = { ...validationErrors };
        delete newErrors[targetName];
        setValidationErrors(newErrors);
      }
    },
    [validationErrors]
  );

  return (
    <Container
      sx={{
        width: '100%',
        mt: theme.space.space6,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: theme.space.space5,
      }}
    >
      <Typography
        sx={{
          fontSize: theme.space.space5,
        }}
      >
        Please provide your name
      </Typography>

      <TextField
        sx={{ width: '100%' }}
        label="First Name"
        name="firstName"
        variant="filled"
        value={firstName}
        onChange={onNameChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        error={!!validationErrors.firstName}
        helperText={validationErrors.firstName}
      />

      <TextField
        sx={{ width: '100%' }}
        label="Last Name"
        name="lastName"
        variant="filled"
        value={lastName}
        onChange={onNameChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        error={!!validationErrors.lastName}
        helperText={validationErrors.lastName}
      />
    </Container>
  );
};
