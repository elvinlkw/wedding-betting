import { QueryResult } from 'pg';
import pool from '../db';

export type QuestionModel = {
  question_id: number;
  question_text: string;
  is_enabled: true;
};

export type ChoicesModel = {
  choice_id: number;
  question_id: number;
  is_right_answer: boolean;
  choice_text: string;
};

export const findAll = (): Promise<QueryResult<QuestionModel>> => {
  return pool.query(`SELECT * FROM questions WHERE is_enabled = TRUE;`);
};

export const findById = (id: string): Promise<QueryResult<QuestionModel>> => {
  return pool.query(`SELECT * FROM questions WHERE question_id = $1`, [id]);
};

type QuestionWithChoicesResponse = {
  choices: ChoicesModel[];
} & QuestionModel;

export const findAllWithChoices = ({
  isAdmin,
}: { isAdmin?: boolean } = {}): Promise<
  QueryResult<QuestionWithChoicesResponse>
> => {
  return pool.query(`SELECT 
    q.question_id,
    q.question_text,
    CASE 
      WHEN COUNT(qc.choice_id) = 0 THEN '[]'::json
      ELSE json_agg(
        json_build_object(
          'choice_id', qc.choice_id, 
          'choice_text', qc.choice_text
          ${isAdmin ? ", 'is_right_answer', qc.is_right_answer" : ''}
        )
      )
    END AS choices 
  FROM questions q
  LEFT JOIN question_choices qc ON q.question_id = qc.question_id
  GROUP BY q.question_id
  ORDER BY q.question_id ASC`);
};

type QuestionBody = {
  text: QuestionModel['question_text'];
  isActive?: QuestionModel['is_enabled'];
};

export const insert = ({ text, isActive = true }: QuestionBody) => {
  return pool.query(
    `INSERT INTO questions (
    question_text, is_enabled
  ) VALUES (
    $1, $2
  ) RETURNING *`,
    [text, isActive]
  );
};

export const update = (
  questionId: string,
  { text, isActive = true }: QuestionBody
) => {
  return pool.query(
    `UPDATE questions
    SET question_text = $1,
        is_enabled = $2
    WHERE question_id = $3
    RETURNING *`,
    [text, isActive, questionId]
  );
};
