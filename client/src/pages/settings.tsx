import { Language, useLanguageStore } from '../store/languageStore';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import { FormattedMessage } from 'react-intl';
import { Header } from '../components';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import theme from '../theme';
import { useState } from 'react';

export const SettingsPage = () => {
  const { language, setLanguage } = useLanguageStore();

  const [backdropOpen, setBackdropOpen] = useState(false);

  return (
    <div>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={backdropOpen}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Header
        title={
          <FormattedMessage
            id="settings.header.title"
            defaultMessage="Settings"
          />
        }
        content={
          <FormattedMessage
            id="settings.header.subtitle"
            defaultMessage="Game settings"
          />
        }
      />

      <Container sx={{ py: 3 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '150px 1fr',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: theme.space.space4,
            width: {
              lg: '900px',
              md: '100%',
              sm: '100%',
            },
          }}
        >
          <Typography fontSize={18} variant="body1">
            <FormattedMessage
              id="settings.language.label"
              defaultMessage="Language"
            />
          </Typography>

          <Select
            value={language}
            variant="standard"
            onChange={(event) => {
              const lang = event.target.value;
              setBackdropOpen(true);

              setTimeout(() => {
                setLanguage(event.target.value as Language);
                localStorage.setItem('gameLanguage', lang);
                setBackdropOpen(false);
              }, 300);
            }}
          >
            <MenuItem value="en">
              <FormattedMessage
                id="settings.language.option.english"
                defaultMessage="English"
              />
            </MenuItem>
            <MenuItem value="fr">
              <FormattedMessage
                id="settings.language.option.french"
                defaultMessage="French"
              />
            </MenuItem>
          </Select>
        </Box>
      </Container>
    </div>
  );
};
