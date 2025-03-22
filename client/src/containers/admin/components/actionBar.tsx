import { Add } from '@mui/icons-material';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useFeatureStore } from '../../../store/featureStore';

type ActionBarProps = {
  onAddQuestionClick?: () => void;
};

export const ActionBar = ({ onAddQuestionClick }: ActionBarProps) => {
  const { featuresMap } = useFeatureStore();

  const isEnabled = featuresMap.get('admin:questions:create')?.isEnabled;

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
