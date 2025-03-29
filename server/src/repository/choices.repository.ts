import { QueryResult } from 'pg';
import pool from '../db';
import { QuestionModel } from './questions.repository';

export type ChoicesModel = {
  choice_id: number;
  question_id: QuestionModel['question_id'];
  is_right_answer: boolean;
  choice_text: string;
  choice_text_fr: string;
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
  choiceTextFr: ChoicesModel['choice_text_fr'];
  isRightAnswer: ChoicesModel['is_right_answer'];
};

export const insert = (
  questionId: string,
  { choiceText, isRightAnswer, choiceTextFr }: ChoicesBody
): Promise<QueryResult<ChoicesModel>> => {
  return pool.query(
    `INSERT INTO question_choices (
        question_id, is_right_answer, choice_text, choice_text_fr
      ) VALUES (
        $1, $2, $3, $4
      ) RETURNING *`,
    [questionId, isRightAnswer, choiceText, choiceTextFr]
  );
};

export const update = (
  questionId: string,
  choiceId: number,
  { choiceText, choiceTextFr, isRightAnswer }: ChoicesBody
): Promise<QueryResult<ChoicesModel>> => {
  return pool.query(
    `UPDATE question_choices 
    SET 
      choice_text = $1, 
      is_right_answer = $2,
      choice_text_fr = $3
    WHERE question_id = $4 AND choice_id = $5
    RETURNING *`,
    [choiceText, isRightAnswer, choiceTextFr, questionId, choiceId]
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
