import Box from '@mui/material/Box';
import { ReactNode } from 'react';
import Typography from '@mui/material/Typography';

type HeaderProps = {
  title: ReactNode;
  content?: ReactNode;
};

export const Header = ({ title, content }: HeaderProps) => {
  return (
    <Box
      sx={{
        p: '54px 32px',
        background: `url('https://t3.ftcdn.net/jpg/07/47/42/72/240_F_747427235_2S80Zm5ulippYLRcrT3gepPCgUXrOdfv.jpg'), linear-gradient(180deg, #E2D3CE 0%, #E3D4CD 100%)`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100%',
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
