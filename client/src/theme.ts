import { type PaletteColor, createTheme } from '@mui/material';

declare module '@mui/material/styles' {
  interface Palette {
    sage: PaletteColor;
  }
  interface PaletteOptions {
    sage: PaletteColor;
  }

  interface Theme {
    space: {
      space0: string;
      space1: string;
      space2: string;
      space3: string;
      space4: string;
      space5: string;
      space6: string;
      space7: string;
      space8: string;
      space9: string;
    };
  }

  interface ThemeOptions {
    space?: {
      space0?: string;
      space1?: string;
      space2?: string;
      space3?: string;
      space4?: string;
      space5?: string;
      space6?: string;
      space7?: string;
      space8?: string;
      space9?: string;
    };
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
  space: {
    space0: '0',
    space1: '4px',
    space2: '8px',
    space3: '12px',
    space4: '16px',
    space5: '24px',
    space6: '36px',
    space7: '48px',
    space8: '64px',
    space9: '96px',
  },
});

export default theme;
