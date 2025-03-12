import { Request, Response } from 'express';
import camelcaseKeys from 'camelcase-keys';
import pool from '../db';
import { questionsRepository } from '../repository';

export const getAllQuestions = async (req: Request, res: Response) => {
  try {
    const includeChoices = req.query.includeChoices === 'true';

    const allQuestions = includeChoices
      ? await questionsRepository.findAllWithChoices()
      : await questionsRepository.findAll();
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

    const allChoices = await pool.query(
      `SELECT * FROM question_choices WHERE question_id = $1`,
      [questionId]
    );

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

    const choices = req.body;

    const promises = choices.map(
      (choice: {
        choiceId?: number;
        choiceText: string;
        isRightAnswer: boolean;
      }) => {
        // TODO: skip if it is edit

        return pool.query(
          `INSERT INTO question_choices (
          question_id, is_right_answer, choice_text
        ) VALUES (
          $1, $2, $3
        ) RETURNING choice_id, choice_text, is_right_answer`,
          [questionId, choice.isRightAnswer, choice.choiceText]
        );
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
