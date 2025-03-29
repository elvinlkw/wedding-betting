import { Button, Container, Stack, Typography } from '@mui/material';
import { useLanguageStore } from '../store/languageStore';
import { useNavigate } from 'react-router';

export const LanguageSelection = () => {
  const navigate = useNavigate();
  const { setLanguage } = useLanguageStore();

  const handleLanguageChange = (language: 'en' | 'fr') => {
    setLanguage(language);
    localStorage.setItem('gameLanguage', language);
    navigate('/');
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
      }}
    >
      <Typography variant="h5" gutterBottom>
        Please select your preferred language to play the game:
      </Typography>
      <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => handleLanguageChange('en')}
        >
          English
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={() => handleLanguageChange('fr')}
        >
          French
        </Button>
      </Stack>
    </Container>
  );
};
