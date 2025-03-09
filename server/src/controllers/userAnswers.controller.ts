import { Request, Response } from 'express';
import camelcaseKeys from 'camelcase-keys';
import pg from 'pg';
import { userAnswersRepository, usersRepository } from '../repository';

const { DatabaseError } = pg;

export const getUserAnswers = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;

    if (userId) {
      const user = await usersRepository.findById(userId);
      if (!user.rowCount) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
    }

    const userAnswers = await userAnswersRepository.findAllByUserId(userId);
    const response = {
      count: userAnswers.rowCount,
      data: userAnswers.rows.map((row) => camelcaseKeys(row, { deep: true })),
    };
    res.json(response);
  } catch (err) {
    const error = err as Error;
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};

export const createUserAnswer = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, answers } = req.body;

    const user = await usersRepository.findByName(firstName, lastName);
    if (user.rowCount) {
      res.status(409).json({
        message: 'A response has already been submitted under this user',
      });
      return;
    }

    const newUser = await usersRepository.insert(firstName, lastName);
    const userId = newUser.rows[0].user_id;

    const promises = answers.map(
      ({ questionId, choiceId }: { questionId: number; choiceId: number }) => {
        return userAnswersRepository.insert({ userId, questionId, choiceId });
      }
    );

    await Promise.all(promises);
    res.json({
      message: 'Responses submitted successfully',
    });
  } catch (err) {
    const error = err as Error;
    console.error(error.message);

    if (error instanceof DatabaseError && error.code === '23502') {
      res.status(400).json({
        status: 'NOT_NULL_VIOLATION',
        statusCode: 400,
        message: `"${error.column}" cannot be empty`,
      });
      return;
    }

    res.status(500).json(error);
  }
};
