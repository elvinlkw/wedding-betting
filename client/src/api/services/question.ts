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
  choiceTextFr: string;
  isRightAnswer: boolean;
};

export type Question = {
  questionId: number;
  questionText: string;
  questionTextFr: string;
  choices: Choice[];
  isAnswerRevealed: boolean;
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
  text: string,
  textFr: string
): Promise<Question> => {
  const config = {
    headers: {
      'x-auth-token': Cookies.get('jwttoken'),
    },
  };
  const response = await axios.post(
    '/api/questions',
    {
      text,
      textFr,
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
      questionTextFr,
      choices,
    }: {
      questionText: string;
      questionTextFr: string;
      choices: Omit<Choice, 'choiceId'>[];
    }) => {
      const question = await createQuestion(questionText, questionTextFr);
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

const updateQuestion = async (
  questionId: number,
  text: string,
  textFr: string
): Promise<Question> => {
  const config = {
    headers: {
      'x-auth-token': Cookies.get('jwttoken'),
    },
  };
  const response = await axios.put(
    `/api/questions/${questionId}`,
    {
      text,
      textFr,
      isActive: true,
    },
    config
  );
  return response.data;
};

const updateQuestionChoice = async (
  questionId: number,
  choices: Omit<Choice, 'choiceId'>[]
): Promise<Choice[]> => {
  const config = {
    headers: {
      'x-auth-token': Cookies.get('jwttoken'),
    },
  };
  const response = await axios.put(
    `/api/questions/${questionId}/choices`,
    choices,
    config
  );
  return response.data;
};

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      questionId,
      questionText,
      questionTextFr,
      choices,
    }: {
      questionId: number;
      questionText: string;
      questionTextFr: string;
      choices: {
        choiceId?: Choice['choiceId'];
        choiceText: Choice['choiceText'];
        choiceTextFr: Choice['choiceTextFr'];
        isRightAnswer: Choice['isRightAnswer'];
      }[];
    }) => {
      const question = await updateQuestion(
        questionId,
        questionText,
        questionTextFr
      );
      if (!choices.length) {
        return {
          ...question,
          choices: [],
        };
      }

      const newChoices = await updateQuestionChoice(
        question.questionId,
        choices
      );
      return {
        ...question,
        choices: newChoices,
      };
    },
    onSuccess: (data) => {
      queryClient.setQueryData<Question[]>(['admin-questions'], (oldData) => {
        return oldData?.map((question) => {
          if (question.questionId === data.questionId) {
            return data;
          }

          return question;
        });
      });
    },
  });
};

const deleteQuestion = async (questionId: number): Promise<void> => {
  const config = {
    headers: {
      'x-auth-token': Cookies.get('jwttoken'),
    },
  };
  const response = await axios.delete(`/api/questions/${questionId}`, config);
  return response.data;
};

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteQuestion,
    onSuccess: (_, variables) => {
      queryClient.setQueryData<Question[]>(['admin-questions'], (oldData) => {
        return oldData?.filter((question) => {
          return question.questionId !== variables;
        });
      });
    },
  });
};

const patchQuestion = async (
  questionId: number,
  { questionText, questionTextFr, isAnswerRevealed }: Partial<Question>
): Promise<Question> => {
  const config = {
    headers: {
      'x-auth-token': Cookies.get('jwttoken'),
    },
  };

  const body: Partial<Question> = {};
  if (isAnswerRevealed !== undefined) {
    body.isAnswerRevealed = isAnswerRevealed;
  }

  if (questionText) {
    body.questionText = questionText;
  }

  if (questionTextFr) {
    body.questionTextFr = questionTextFr;
  }

  const response = await axios.patch(
    `/api/questions/${questionId}`,
    body,
    config
  );
  return response.data;
};

export const usePatchQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      questionId,
      ...rest
    }: {
      questionId: number;
      questionText?: string;
      isAnswerRevealed?: boolean;
    }) => patchQuestion(questionId, rest),
    onSuccess: (data) => {
      queryClient.setQueryData<Question[]>(['admin-questions'], (oldData) => {
        return oldData?.map((question) => {
          if (question.questionId === data.questionId) {
            return {
              ...data,
              choices: question.choices,
            };
          }

          return question;
        });
      });
    },
  });
};
