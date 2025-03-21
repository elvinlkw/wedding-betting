import { QueryResult } from 'pg';
import pool from '../db';
import { QuestionModel } from './questions.repository';

export type ChoicesModel = {
  choice_id: number;
  question_id: QuestionModel['question_id'];
  is_right_answer: boolean;
  choice_text: string;
  created_at: Date;
  updated_at: Date;
};

export const findAll = (): Promise<QueryResult<ChoicesModel[]>> => {
  return pool.query('SELECT * FROM question_choices');
};

export const findById = (id: string): Promise<QueryResult<ChoicesModel>> => {
  return pool.query('SELECT * FROM question_choices WHERE question_id = $1', [
    id,
  ]);
};

type ChoicesBody = {
  choiceText: ChoicesModel['choice_text'];
  isRightAnswer: ChoicesModel['is_right_answer'];
};

export const insert = (
  questionId: string,
  { choiceText, isRightAnswer }: ChoicesBody
): Promise<QueryResult<ChoicesModel>> => {
  return pool.query(
    `INSERT INTO question_choices (
        question_id, is_right_answer, choice_text
      ) VALUES (
        $1, $2, $3
      ) RETURNING *`,
    [questionId, isRightAnswer, choiceText]
  );
};

export const update = (
  questionId: string,
  choiceId: number,
  { choiceText, isRightAnswer }: ChoicesBody
): Promise<QueryResult<ChoicesModel>> => {
  return pool.query(
    `UPDATE question_choices SET choice_text = $1, is_right_answer = $2 WHERE question_id = $3 AND choice_id = $4 RETURNING *`,
    [choiceText, isRightAnswer, questionId, choiceId]
  );
};

export const removeAll = (questionId: string | number) => {
  return pool.query(`DELETE FROM question_choices WHERE question_id = $1`, [
    questionId,
  ]);
};

export const removeOne = (choiceId: number) => {
  return pool.query(`DELETE FROM question_choices WHERE choice_id = $1`, [
    choiceId,
  ]);
};
