import { QueryResult } from 'pg';
import pool from '../db';
import { UserModel } from './users.repository';
import { ChoicesModel, QuestionModel } from './questions.repository';

type UserAnswerModel = {
  question_id: QuestionModel['question_id'];
  question_text: QuestionModel['question_text'];
  choice_id: ChoicesModel['choice_id'];
  choice_text: ChoicesModel['choice_text'];
  is_right_answer: ChoicesModel['is_right_answer'];
};

type UserAnswerResponse = {
  user_id: UserModel['user_id'];
  first_name: UserModel['first_name'];
  last_name: UserModel['last_name'];
  answers: UserAnswerModel[];
};

export const findAllByUserId = (
  id: string
): Promise<QueryResult<UserAnswerResponse>> => {
  return pool.query(
    `
      SELECT 
        u.user_id,
        u.first_name,
        u.last_name,
        json_agg(
          json_build_object(
            'question_id', ua.question_id,
            'question_text', q.question_text,
            'choice_id', qc.choice_id, 
            'choice_text', qc.choice_text,
            'is_right_answer', qc.is_right_answer
          )
        ) AS answers
      FROM users u
      LEFT JOIN user_answers ua ON u.user_id = ua.user_id
      LEFT JOIN questions q ON q.question_id = ua.question_id
      LEFT JOIN question_choices qc ON qc.choice_id = ua.choice_id
      ${id ? 'WHERE u.user_id = $1' : ''}
      GROUP BY u.user_id
      ORDER BY u.user_id ASC
    `,
    id ? [id] : undefined
  );
};

type InsertBody = {
  userId: UserModel['user_id'];
  questionId: QuestionModel['question_id'];
  choiceId: ChoicesModel['choice_id'];
};

export const insert = ({ userId, questionId, choiceId }: InsertBody) => {
  return pool.query(
    `
    INSERT INTO user_answers (
      user_id, question_id, choice_id
    ) VALUES (
      $1, $2, $3
    ) RETURNING *`,
    [userId, questionId, choiceId]
  );
};
