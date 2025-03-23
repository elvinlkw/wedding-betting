import { type PaletteColor, createTheme } from '@mui/material';

declare module '@mui/material/styles' {
  interface Palette {
    sage: PaletteColor;
  }
  interface PaletteOptions {
    sage: PaletteColor;
  }
}

const theme = createTheme({
  palette: {
    sage: {
      main: '#87ae73',
      light: '#bad1af',
      dark: '#689154',
      contrastText: '#ffffff',
    },
  },
});

export default theme;
