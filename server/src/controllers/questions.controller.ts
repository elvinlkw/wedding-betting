import { Request, Response } from 'express';
import camelcaseKeys from 'camelcase-keys';
import pool from '../db';
import { choicesRepository, questionsRepository } from '../repository';
import { ErrorType, LanguageType } from '../types';
import { QuestionModel } from '../repository/questions.repository';

const getQuestionText = <T extends Partial<QuestionModel>>(
  row: T,
  language: LanguageType
) => {
  console.log(row);
  const questionText =
    language === 'fr' ? row.question_text_fr : row.question_text;
  row.question_text = questionText;
  delete row.question_text_fr;

  return camelcaseKeys(row, { deep: true });
};

export const getAllQuestions = async (req: Request, res: Response) => {
  try {
    const language = (req.headers['accept-language'] || 'en') as LanguageType;
    const includeChoices = req.query.includeChoices === 'true';
    const includeRevealed = req.query.includeRevealed === 'true';

    const allQuestions = includeChoices
      ? await questionsRepository.findAllWithChoices({ includeRevealed })
      : await questionsRepository.findAll();
    const response = {
      count: allQuestions.rowCount,
      data: allQuestions.rows.map((row: any) => getQuestionText(row, language)),
    };
    res.json(response);
  } catch (err) {
    const error = err as Error;
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getAllAdminQuestions = async (req: Request, res: Response) => {
  try {
    const allQuestions = await questionsRepository.findAllWithChoices({
      isAdmin: true,
    });

    const response = {
      count: allQuestions.rowCount,
      data: allQuestions.rows.map((row) => camelcaseKeys(row, { deep: true })),
    };
    res.json(response);
  } catch (err) {
    const error = err as Error;
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const newQuestion = await questionsRepository.insert(req.body);
    res.json(camelcaseKeys(newQuestion.rows[0], { deep: true }));
  } catch (err) {
    const error = err as Error;
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const questionId = req.params.questionId;

    const question = await questionsRepository.findById(questionId);
    if (!question.rowCount) {
      console.error('Invalid question id');
      res.status(404).json({
        message: `Invalid question id`,
      });
      return;
    }

    const updatedQuestion = await questionsRepository.update(
      questionId,
      req.body
    );
    res.json(camelcaseKeys(updatedQuestion.rows[0], { deep: true }));
  } catch (err) {
    const error = err as Error;
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};

export const patch = async (req: Request, res: Response) => {
  try {
    const questionId = req.params.questionId;

    const question = await questionsRepository.findById(questionId);
    if (!question.rowCount) {
      console.error('Invalid question id');
      res.status(404).json({
        message: `Invalid question id`,
      });
      return;
    }

    const { questionText, isEnabled, isAnswerRevealed, questionTextFr } =
      req.body;

    const fieldsToUpdate = [];
    const values = [];
    let query = 'UPDATE questions SET ';

    if (questionText !== undefined) {
      fieldsToUpdate.push('question_text = $' + (fieldsToUpdate.length + 1));
      values.push(questionText);
    }

    if (questionTextFr !== undefined) {
      fieldsToUpdate.push('question_text_fr = $' + (fieldsToUpdate.length + 1));
      values.push(questionTextFr);
    }

    if (isEnabled !== undefined) {
      fieldsToUpdate.push('is_enabled = $' + (fieldsToUpdate.length + 1));
      values.push(isEnabled);
    }

    if (isAnswerRevealed !== undefined) {
      fieldsToUpdate.push(
        'is_answer_revealed = $' + (fieldsToUpdate.length + 1)
      );
      values.push(isAnswerRevealed);
    }

    if (fieldsToUpdate.length === 0) {
      res.status(400).json({ message: 'No fields to update' });
      return;
    }

    query +=
      fieldsToUpdate.join(', ') +
      ' WHERE question_id = $' +
      (fieldsToUpdate.length + 1) +
      ' RETURNING *';
    values.push(questionId);

    const updatedQuestion = await pool.query(query, values);
    res.json(camelcaseKeys(updatedQuestion.rows[0], { deep: true }));
  } catch (err) {
    const error = err as Error;
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const questionId = req.params.questionId;

    const question = await questionsRepository.findById(questionId);
    if (!question.rowCount) {
      console.error('Invalid question id');
      res.status(404).json({
        message: `Invalid question id`,
      });
      return;
    }

    await questionsRepository.remove(questionId);
    res.json({ message: 'Successfully removed question' });
  } catch (err) {
    const error = err as Error;
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getChoicesByQuestionId = async (req: Request, res: Response) => {
  try {
    const questionId = req.params.id;
    const question = await questionsRepository.findById(questionId);
    if (!question.rowCount) {
      console.error('Invalid question id');
      res.status(404).json({
        message: `Invalid question id`,
      });
      return;
    }

    const allChoices = await choicesRepository.findById(questionId);

    const response = {
      count: allChoices.rowCount,
      data: {
        question: question.rows[0].question_text,
        choices: allChoices.rows.map((row) =>
          camelcaseKeys(row, { deep: true })
        ),
      },
    };
    res.json(response);
  } catch (err) {
    const error = err as Error;
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};

export const createChoice = async (req: Request, res: Response) => {
  try {
    const questionId = req.params.id;

    const question = await questionsRepository.findById(questionId);
    if (!question.rowCount) {
      console.error('Invalid question id');
      res.status(404).json({
        message: `Invalid question id`,
      });
      return;
    }

    // TODO: improve this
    const allChoices = await choicesRepository.findById(questionId);
    if (allChoices.rowCount) {
      await choicesRepository.removeAll(questionId);
    }

    const choices = req.body;

    const promises = choices.map(
      (choice: {
        choiceId?: number;
        choiceText: string;
        isRightAnswer: boolean;
      }) => {
        return choicesRepository.insert(questionId, choice);
      }
    );

    const responses = await Promise.all(promises);

    const formattedResponses = responses.map((res) => {
      return res.rows[0];
    });

    res.json(camelcaseKeys(formattedResponses, { deep: true }));
  } catch (err) {
    const error = err as Error;
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};

type ChoiceUpdateParams = {
  id: string;
};

type ChoiceUpdateBody = {
  choiceId?: number;
  choiceText: string;
  isRightAnswer: boolean;
};

type ChoiceUpdateResponse = {
  choiceId: number;
  choiceText: string;
  isRightAnswer: boolean;
};

export const updateBatchChoices = async (
  req: Request<ChoiceUpdateParams, null, ChoiceUpdateBody[]>,
  res: Response<ChoiceUpdateResponse[] | ErrorType>
) => {
  try {
    // Check for questions exist
    const questionId = req.params.id;
    const question = await questionsRepository.findById(questionId);
    if (!question.rowCount) {
      console.error('Invalid question id');
      res.status(404).json({
        message: `Invalid question id`,
      });
      return;
    }

    const storedChoices = await choicesRepository.findById(questionId);
    let temp = structuredClone(storedChoices.rows);

    const choicesToUpdate = req.body;

    const createPromises: Array<ReturnType<typeof choicesRepository.insert>> =
      [];
    const updatePromises: Array<ReturnType<typeof choicesRepository.update>> =
      [];

    choicesToUpdate.forEach((choice) => {
      if (choice?.choiceId) {
        // Update choice entry
        const storedChoice = temp.find(
          (ch) => ch.choice_id === choice.choiceId
        );
        if (!storedChoice) {
          res
            .status(404)
            .json({ message: `Choice with id ${choice.choiceId} not found` });
          return;
        }
        updatePromises.push(
          choicesRepository.update(questionId, choice.choiceId, choice)
        );
        // Remove the choice from the storedChoices temp
        temp = temp.filter((ch) => ch.choice_id !== choice.choiceId);
      } else {
        // Create new choice entry
        createPromises.push(choicesRepository.insert(questionId, choice));
      }
    });

    const deletePromise = temp.map((choice) => {
      return choicesRepository.removeOne(choice.choice_id);
    });

    // Execute all promises
    await Promise.all(deletePromise);
    const updateResponse = await Promise.all(updatePromises);
    const createResponse = await Promise.all(createPromises);

    // Combine and format the responses
    const response = [
      ...updateResponse.map((res) => res.rows.map((row) => camelcaseKeys(row))),
      ...createResponse.map((res) => res.rows.map((row) => camelcaseKeys(row))),
    ].flat();

    res.json(response);
  } catch (err) {
    const error = err as Error;
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};
