import axios from 'axios';

type Choice = {
  choiceId: number;
  choiceText: string;
};

export type GameQuestion = {
  questionId: number;
  questionText: string;
  isAnswerRevealed: boolean;
  choices: Choice[];
};

class Questions {
  async getGameQuestions(): Promise<GameQuestion[]> {
    const response = await axios.get('/api/questions?includeChoices=true');
    return response.data.data;
  }
}

export default new Questions();
