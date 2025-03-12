import { Add, Delete } from '@mui/icons-material';
import { Button, Checkbox, Input, Stack, TextField } from '@mui/material';
import { Choice, useCreateQuestion } from '../../../api/services/question';
import {
  Control,
  Controller,
  UseFormSetValue,
  useFieldArray,
  useForm,
  useWatch,
} from 'react-hook-form';
import { array, boolean, object, string } from 'yup';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MuiModal from '@mui/material/Modal';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = object({
  questionText: string().required('Question text is required'),
  choices: array()
    .of(
      object({
        choiceText: string().required('Choice text is required'),
        isRightAnswer: boolean().default(false).required(),
      })
    )
    .required('Choices are required')
    .default([]),
});

type FormValues = {
  questionText: string;
  choices: Omit<Choice, 'choiceId'>[];
};

type ChoicesArrayField = {
  control: Control<FormValues>;
  setValue: UseFormSetValue<FormValues>;
};

const ChoicesArrayField = ({ control, setValue }: ChoicesArrayField) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'choices',
  });

  const choices = useWatch({
    control,
    name: 'choices',
  });

  const handleCheckboxChange = (index: number) => {
    const updatedChoices = choices.map((choice, i) => ({
      ...choice,
      isRightAnswer: i === index && !choice.isRightAnswer,
    }));
    setValue('choices', updatedChoices);
  };

  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          component={'label'}
          sx={{ fontSize: '12px', color: '#999', alignSelf: 'flex-end' }}
        >
          Choices
        </Typography>
        <Button
          onClick={() =>
            append({
              choiceText: '',
              isRightAnswer: false,
            })
          }
          sx={{
            paddingX: 0,
            justifyContent: 'flex-end',
            minWidth: 'fit-content',
            color: '#999',
          }}
        >
          <Add sx={{ width: '20px', height: '20px' }} />
        </Button>
      </Box>
      {fields.map((item, index) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }} key={item.id}>
          <Controller
            key={`choice-text-${item.id}`}
            name={`choices.${index}.choiceText`}
            render={({ field }) => (
              <Input
                {...field}
                name={`choices.${index}.text`}
                sx={{ width: '100%' }}
                type="text"
              />
            )}
            control={control}
          />
          <Controller
            key={`choice-is-right-answer-${item.id}`}
            name={`choices.${index}.isRightAnswer`}
            render={({ field }) => (
              <Tooltip title="Is right answer?" placement="bottom">
                <Checkbox
                  sx={{ p: 0 }}
                  {...field}
                  checked={field.value}
                  onChange={() => handleCheckboxChange(index)}
                />
              </Tooltip>
            )}
            control={control}
          />

          <IconButton color="error" onClick={() => remove(index)}>
            <Tooltip title="Delete Choice">
              <Delete />
            </Tooltip>
          </IconButton>
        </Box>
      ))}
    </div>
  );
};

type ModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const Modal = ({ open, setOpen }: ModalProps) => {
  const { control, reset, handleSubmit, setValue } = useForm<FormValues>({
    mode: 'onBlur',
    defaultValues: {
      questionText: '',
      choices: [
        {
          choiceText: '',
          isRightAnswer: false,
        },
      ],
    },
    resolver: yupResolver(schema),
  });

  const { mutateAsync: createQuestion } = useCreateQuestion();

  const handleClose = () => {
    reset();
    setOpen(false);
  };

  const submit = async (data: FormValues) => {
    const { choices, questionText } = data;
    try {
      const response = await createQuestion({
        questionText,
        choices,
      });
      console.log(response);
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <MuiModal open={open} onClose={handleClose}>
      <form onSubmit={handleSubmit(submit)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            border: '1px solid #000',
            borderRadius: '12px',
            boxShadow: 24,
            width: {
              xs: '100%', // 100% width for mobile devices
              md: '400px', // 400px width for larger devices
            },
            boxSizing: {
              xs: 'border-box',
            },
            p: {
              xs: 2,
              md: 4,
            },
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <Typography component="h2">Add Question</Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Controller
              control={control}
              name="questionText"
              render={({ field, fieldState }) => (
                <Box>
                  <Typography
                    component={'label'}
                    sx={{
                      fontSize: '12px',
                      color: fieldState.error
                        ? 'rgb(211, 47, 47)'
                        : 'rgba(0, 0, 0, 0.6)',
                    }}
                  >
                    Question Text
                  </Typography>
                  <TextField
                    {...field}
                    sx={{ width: '100%' }}
                    required
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    variant="standard"
                  />
                </Box>
              )}
            />
            <ChoicesArrayField control={control} setValue={setValue} />
          </Box>

          <Stack justifyContent={'flex-end'} direction={'row'} gap={1}>
            <Button
              onClick={handleClose}
              type="button"
              color="secondary"
              variant="outlined"
              size="small"
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained" size="small">
              Submit
            </Button>
          </Stack>
        </Box>
      </form>
    </MuiModal>
  );
};
