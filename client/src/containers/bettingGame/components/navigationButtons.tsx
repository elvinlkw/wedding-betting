import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import theme from '../../../theme';
import { useScreenOrientation } from '../../../hooks';

type NavigationButtonProps = {
  onPreviousClick?: () => void;
  onNextClick?: () => void;
  onSubmit?: () => void;
  currentPage: number;
  totalCount: number;
};

export const NavigationButton = ({
  onPreviousClick,
  onNextClick,
  onSubmit,
  currentPage,
  totalCount,
}: NavigationButtonProps) => {
  const { isPortrait } = useScreenOrientation();

  return (
    <Box
      sx={
        isPortrait
          ? {
              position: 'fixed',
              left: 0,
              right: 0,
              bottom: '56px',
              pb: theme.space.space4,
            }
          : undefined
      }
    >
      <Container
        maxWidth="xs"
        sx={{
          mt: theme.space.space4,
          pb: isPortrait ? theme.space.space0 : theme.space.space8,
        }}
      >
        <Stack
          direction="column"
          justifyContent="space-between"
          gap={theme.space.space2}
        >
          <Button
            disabled={currentPage === 0}
            variant="outlined"
            onClick={onPreviousClick}
          >
            Previous
          </Button>
          <Button
            variant="contained"
            onClick={currentPage === totalCount ? onSubmit : onNextClick}
          >
            {currentPage === totalCount ? 'Submit' : 'Next'}
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};
