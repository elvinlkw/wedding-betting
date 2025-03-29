import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { FormattedMessage } from 'react-intl';
import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import theme from '../../../theme';
import { useFormStatus } from 'react-dom';
import { useScreenOrientation } from '../../../hooks';

type NavigationButtonProps = {
  onPreviousClick?: () => void;
  onNextClick?: () => void;
  onSubmit?: () => void;
  currentPage: number;
  totalCount: number;
  formError: string | null;
};

export const NavigationButton = ({
  onPreviousClick,
  onNextClick,
  onSubmit,
  currentPage,
  totalCount,
  formError,
}: NavigationButtonProps) => {
  const { isPortrait } = useScreenOrientation();

  const status = useFormStatus();

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
        {formError && (
          <Typography
            color="error"
            sx={{
              mb: theme.space.space3,
              display: 'flex',
              alignItems: 'center',
              gap: theme.space.space2,
              fontSize: '14px',
            }}
          >
            <WarningIcon fontSize="small" />
            {formError}
          </Typography>
        )}
        <Stack
          direction="column"
          justifyContent="space-between"
          gap={theme.space.space2}
        >
          {currentPage > 0 && (
            <Button variant="outlined" onClick={onPreviousClick}>
              <FormattedMessage id="cta.previous" defaultMessage="Previous" />
            </Button>
          )}
          <Button
            variant="contained"
            onClick={currentPage === totalCount ? onSubmit : onNextClick}
            disabled={status.pending}
          >
            {currentPage === totalCount ? (
              <FormattedMessage id="cta.submit" defaultMessage="Submit" />
            ) : (
              <FormattedMessage id="cta.next" defaultMessage="Next" />
            )}
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};
