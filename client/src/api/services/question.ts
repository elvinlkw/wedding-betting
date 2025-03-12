import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import Cookies from 'js-cookie';
import axios from 'axios';

export type Choice = {
  choiceId: number;
  choiceText: string;
  isRightAnswer: boolean;
};

export type Question = {
  questionId: number;
  questionText: string;
  choices: Choice[];
};

const getQuestionsForAdmins = async (): Promise<Question[]> => {
  const config = {
    headers: {
      'x-auth-token': Cookies.get('jwttoken'),
    },
  };
  const response = await axios.get('/api/questions/admin', config);
  return response.data.data;
};

export const useQuestions = (): UseQueryResult<Question[]> => {
  return useQuery<Question[]>({
    queryKey: ['admin-questions'],
    queryFn: getQuestionsForAdmins,
  });
};

const createQuestion = async (
  text: string
): Promise<Pick<Question, 'questionId' | 'questionText'>> => {
  const config = {
    headers: {
      'x-auth-token': Cookies.get('jwttoken'),
    },
  };
  const response = await axios.post(
    '/api/questions',
    {
      text,
      isActive: true,
    },
    config
  );
  return response.data;
};

const createQuestionChoice = async (
  questionId: number,
  choices: Omit<Choice, 'choiceId'>[]
): Promise<Choice[]> => {
  const config = {
    headers: {
      'x-auth-token': Cookies.get('jwttoken'),
    },
  };
  const response = await axios.post(
    `/api/questions/${questionId}/choices`,
    choices,
    config
  );
  return response.data;
};

export const useCreateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      questionText,
      choices,
    }: {
      questionText: string;
      choices: Omit<Choice, 'choiceId'>[];
    }) => {
      const question = await createQuestion(questionText);
      if (!choices.length) {
        return {
          ...question,
          choices: [],
        };
      }

      const newChoices = await createQuestionChoice(
        question.questionId,
        choices
      );
      return {
        ...question,
        choices: newChoices,
      };
    },
    onSuccess: (data) => {
      // Update the query cache with the new data
      // queryClient.invalidateQueries({ queryKey: ['admin-questions'] });
      const newQuestion = {
        ...data,
      };

      queryClient.setQueryData<Question[]>(['admin-questions'], (oldData) => {
        return oldData ? [...oldData, newQuestion] : [newQuestion];
      });
    },
  });
};
