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

    const { questionText, isEnabled, isAnswerRevealed } = req.body;

    const fieldsToUpdate = [];
    const values = [];
    let query = 'UPDATE questions SET ';

    if (questionText !== undefined) {
      fieldsToUpdate.push('question_text = $' + (fieldsToUpdate.length + 1));
      values.push(questionText);
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

    // TODO: improve this
    const allChoices = await pool.query(
      `SELECT * FROM question_choices WHERE question_id = $1`,
      [questionId]
    );
    if (allChoices.rowCount) {
      await pool.query(`DELETE FROM question_choices WHERE question_id = $1`, [
        questionId,
      ]);
    }

    const choices = req.body;

    const promises = choices.map(
      (choice: {
        choiceId?: number;
        choiceText: string;
        isRightAnswer: boolean;
      }) => {
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
