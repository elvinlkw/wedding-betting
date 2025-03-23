import Box from '@mui/material/Box';
import { NavLink } from 'react-router';

export const BettingGamePage = () => {
  return (
    <Box>
      <div>
        <NavLink to="/admin">Admin</NavLink>
        <div>BettingGame</div>
      </div>
    </Box>
  );
};
