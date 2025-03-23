import Box from '@mui/material/Box';
import { ReactNode } from 'react';
import Typography from '@mui/material/Typography';

type HeaderProps = {
  title: ReactNode;
  content: ReactNode;
};

export const Header = ({ title, content }: HeaderProps) => {
  return (
    <Box
      sx={{
        p: '54px 32px',
        background:
          // 'linear-gradient(0.25turn,rgb(88, 138, 159), rgb(223, 156, 84))',
          // 'linear-gradient(0.25turn,  #CDC1A7, #87ae73)',
          // 'linear-gradient(to right, #A8BBA6, #7C8B72);',
          'linear-gradient(to bottom right, #87ae73, #A8BBA6, #6E7A52)',
      }}
    >
      <Typography
        variant="h1"
        align="center"
        sx={{ fontSize: '36px', fontWeight: '400', my: '16px' }}
      >
        {title}
      </Typography>

      <Typography align="center">{content}</Typography>
    </Box>
  );
};
