import { Add } from '@mui/icons-material';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

type ActionBarProps = {
  onAddQuestionClick?: () => void;
};

export const ActionBar = ({ onAddQuestionClick }: ActionBarProps) => {
  return (
    <>
      <Stack direction="row" marginY={1} justifyContent="flex-end">
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={onAddQuestionClick}
        >
          Add Question
        </Button>
      </Stack>
    </>
  );
};
