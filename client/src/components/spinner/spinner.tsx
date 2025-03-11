import CircularProgress from '@mui/material/CircularProgress';
import styled from '@emotion/styled';

const SpinnerContainer = styled.div({
  width: '100svw',
  height: '100svh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export const Spinner = () => {
  return (
    <SpinnerContainer>
      <CircularProgress size={64} />
    </SpinnerContainer>
  );
};
