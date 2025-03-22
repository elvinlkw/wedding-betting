import { Request, Response } from 'express';
import pool from '../db';
import { UserModel } from '../repository/users.repository';
import { ErrorType } from '../types';
import { questionsRepository } from '../repository';

type UserScoreboard = {
  id: UserModel['user_id'];
  firstName: UserModel['first_name'];
  lastName: UserModel['last_name'];
  percentCorrect: number;
};

type UserScoreboardResponse = {
  totalQuestions: number;
  questionsRevealed: number;
  userScoreboard: Array<UserScoreboard>;
};

const EMPTY_RESPONSE: UserScoreboardResponse = {
  totalQuestions: 0,
  questionsRevealed: 0,
  userScoreboard: [],
};

export const getScoreboard = async (
  req: Request<null, null, null>,
  res: Response<UserScoreboardResponse | ErrorType>
) => {
  try {
    // get all revealed questions
    const revealedQuestions = await questionsRepository.findAllRevealed();
    if (revealedQuestions.rowCount === 0) {
      res.json(EMPTY_RESPONSE);
      return;
    }

    // get total number of questions
    const totalQuestions = await questionsRepository.findAll();
    const totalQuestionsCount = totalQuestions.rowCount || 0;

    const revealedQuestionIds = revealedQuestions.rows.map(
      (row) => row.question_id
    );

    // get all user answers for each question_id that has revealed
    const userAnswersWithCorrectness = await pool.query(
      `SELECT 
        ua.user_id,
        u.first_name,
        u.last_name,
        COUNT(CASE WHEN qc.is_right_answer THEN 1 END)::int AS correct_answers,
        ROUND(
          (COUNT(CASE WHEN qc.is_right_answer THEN 1 END)::decimal / 
          NULLIF(COUNT(ua.question_id), 0)) * 100, 2
        )::FLOAT AS percent_correct 
      FROM user_answers ua
      INNER JOIN question_choices qc ON ua.choice_id = qc.choice_id
      INNER JOIN users u ON ua.user_id = u.user_id
      WHERE ua.question_id = ANY($1)
      GROUP BY ua.user_id, u.first_name, u.last_name
      ORDER BY percent_correct DESC`,
      [revealedQuestionIds]
    );

    const response = {
      totalQuestions: totalQuestionsCount,
      questionsRevealed: revealedQuestionIds.length,
      userScoreboard: userAnswersWithCorrectness.rows as Array<UserScoreboard>,
    };

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
