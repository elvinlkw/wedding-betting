import pool from "../db";

export const findAll = () => {
  return pool.query(
    `SELECT question_id, question_text FROM questions WHERE is_enabled = TRUE;`
  );
};

export const findById = (id: string) => {
  return pool.query(
    `SELECT question_text FROM questions WHERE question_id = $1`,
    [id]
  );
};

export const findAllWithChoices = () => {
  return pool.query(`SELECT 
    q.question_id,
    q.question_text,
    json_agg(
      json_build_object(
        'choice_id', qc.choice_id, 
        'choice_text', qc.choice_text
      )
    ) AS choices 
  FROM questions q
  LEFT JOIN question_choices qc ON q.question_id = qc.question_id
  GROUP BY q.question_id
  ORDER BY q.question_id ASC`);
};

type QuestionBody = {
  text: string;
  isActive?: boolean;
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
