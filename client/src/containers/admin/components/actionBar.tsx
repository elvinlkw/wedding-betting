import { Add } from '@mui/icons-material';
import Button from '@mui/material/Button';
import { FEATURE_CREATE_QUESTION } from '../../../features';
import Stack from '@mui/material/Stack';
import { useFeatureFlag } from '../../../hooks/useFeatureFlag.hooks';

type ActionBarProps = {
  onAddQuestionClick?: () => void;
};

export const ActionBar = ({ onAddQuestionClick }: ActionBarProps) => {
  const isEnabled = useFeatureFlag(FEATURE_CREATE_QUESTION);

  return (
    <>
      <Stack direction="row" marginY={1} justifyContent="flex-end">
        {isEnabled && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={onAddQuestionClick}
          >
            Add Question
          </Button>
        )}
      </Stack>
    </>
  );
};
