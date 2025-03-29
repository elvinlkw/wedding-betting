import { QueryResult } from 'pg';
import pool from '../db';

export type QuestionModel = {
  question_id: number;
  question_text: string;
  question_text_fr: string;
  is_enabled: true;
  is_answer_revealed: boolean;
};

export type ChoicesModel = {
  choice_id: number;
  question_id: number;
  is_right_answer: boolean;
  choice_text: string;
  choice_text_fr: string;
};

export const findAll = (): Promise<QueryResult<QuestionModel[]>> => {
  return pool.query(`SELECT * FROM questions WHERE is_enabled = TRUE;`);
};

export const findById = (id: string): Promise<QueryResult<QuestionModel>> => {
  return pool.query(`SELECT * FROM questions WHERE question_id = $1`, [id]);
};

export const findAllRevealed = () => {
  return pool.query(`SELECT * FROM questions WHERE is_answer_revealed = TRUE;`);
};

export type QuestionWithChoicesResponse = {
  choices: ChoicesModel[];
} & QuestionModel;

export const findAllWithChoices = ({
  isAdmin,
  includeRevealed,
}: { isAdmin?: boolean; includeRevealed?: boolean } = {}): Promise<
  QueryResult<QuestionWithChoicesResponse>
> => {
  const whereClause =
    includeRevealed === false ? `WHERE q.is_answer_revealed = FALSE` : '';

  return pool.query(`SELECT 
    q.question_id,
    q.question_text,
    q.question_text_fr,
    q.is_answer_revealed,
    CASE 
      WHEN COUNT(qc.choice_id) = 0 THEN '[]'::json
      ELSE json_agg(
        json_build_object(
          'choice_id', qc.choice_id, 
          'choice_text_fr', qc.choice_text_fr,
          'choice_text', qc.choice_text
          ${isAdmin ? ", 'is_right_answer', qc.is_right_answer" : ''}
        )
      )
    END AS choices 
  FROM questions q
  LEFT JOIN question_choices qc ON q.question_id = qc.question_id
  ${whereClause}
  GROUP BY q.question_id
  ORDER BY q.question_id ASC`);
};

type QuestionBody = {
  text: QuestionModel['question_text'];
  textFr: QuestionModel['question_text_fr'];
  isActive?: QuestionModel['is_enabled'];
};

export const insert = ({ text, textFr, isActive = true }: QuestionBody) => {
  return pool.query(
    `INSERT INTO questions (
    question_text, question_text_fr, is_enabled
  ) VALUES (
    $1, $2, $3
  ) RETURNING *`,
    [text, textFr, isActive]
  );
};

export const update = (
  questionId: string,
  { text, textFr, isActive = true }: QuestionBody
) => {
  return pool.query(
    `UPDATE questions
    SET question_text = $1,
        question_text_fr = $2,
        is_enabled = $3
    WHERE question_id = $4
    RETURNING *`,
    [text, textFr, isActive, questionId]
  );
};

export const remove = (questionId: string) => {
  return pool.query(
    `DELETE FROM questions
    WHERE question_id = $1`,
    [questionId]
  );
};
