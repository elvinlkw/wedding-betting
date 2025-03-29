import { Container, TextField, Typography } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';
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
  const intl = useIntl();
  const [validationErrors, setValidationErrors] = useState<{
    firstName?: string;
    lastName?: string;
  }>({});

  useEffect(() => {
    if (formError) {
      setValidationErrors({
        ...(firstName.length === 0
          ? {
              firstName: intl.formatMessage({
                id: 'homepage.namefield.error.required',
              }),
            }
          : {}),
        ...(lastName.length === 0
          ? {
              lastName: intl.formatMessage({
                id: 'homepage.namefield.error.required',
              }),
            }
          : {}),
      });
      return;
    }

    setValidationErrors({});
  }, [formError, firstName, lastName, intl]);

  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement>): void => {
      if (event.target.value.length === 0) {
        setValidationErrors({
          ...validationErrors,
          [event.target.name]: intl.formatMessage({
            id: 'homepage.namefield.error.required',
          }),
        });
      }
    },
    [validationErrors, intl]
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
        <FormattedMessage
          id="homepage.namefield.title"
          defaultMessage="Please provide your name"
        />
      </Typography>

      <TextField
        sx={{ width: '100%' }}
        label={intl.formatMessage({
          id: 'homepage.namefield.label.firstName',
          defaultMessage: 'First Name',
        })}
        name="firstName"
        variant="filled"
        value={firstName}
        onChange={onNameChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        error={!!validationErrors.firstName}
        helperText={validationErrors.firstName}
        autoComplete="off"
      />

      <TextField
        sx={{ width: '100%' }}
        label={intl.formatMessage({
          id: 'homepage.namefield.label.lastName',
          defaultMessage: 'Last Name',
        })}
        name="lastName"
        variant="filled"
        value={lastName}
        onChange={onNameChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        error={!!validationErrors.lastName}
        helperText={validationErrors.lastName}
        autoComplete="off"
      />
    </Container>
  );
};
