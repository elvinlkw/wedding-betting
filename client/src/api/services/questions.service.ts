import apiClient from '../interceptors';

type Choice = {
  choiceId: number;
  choiceText: string;
  isRightAnswer?: boolean;
};

export type GameQuestion = {
  questionId: number;
  questionText: string;
  isAnswerRevealed: boolean;
  choices: Choice[];
};

class Questions {
  async getGameQuestions(
    revealedOnly: boolean = false
  ): Promise<GameQuestion[]> {
    const gameLanguage = localStorage.getItem('gameLanguage') || 'en';

    const response = await apiClient.get(
      `/api/questions?includeChoices=true&${
        revealedOnly ? 'includeRevealed=true' : ''
      }`,
      {
        headers: {
          'Accept-Language': gameLanguage,
        },
      }
    );
    return response.data.data;
  }
}

export default new Questions();
