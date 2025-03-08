import express, { Request, Response } from "express";
import camelcaseKeys from "camelcase-keys";
import pool from "../db";

const router = express.Router();

/**
 * Get all active questions
 */
router.get("/", async (req, res) => {
  try {
    const includeChoices = req.query.includeChoices === "true";

    let query;
    if (includeChoices) {
      query = `SELECT 
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
      ORDER BY q.question_id ASC;`;
    } else {
      query = `SELECT question_id, question_text FROM questions WHERE is_enabled = TRUE;`;
    }

    const allQuestions = await pool.query(query);
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
});

/**
 * Create a question
 */
router.post("/", async (req, res) => {
  try {
    const { text, isActive = true } = req.body;
    const newQuestion = await pool.query(
      `INSERT INTO questions (
      question_text, is_enabled
    ) VALUES (
      $1, $2
    ) RETURNING *`,
      [text, isActive]
    );
    res.json(newQuestion.rows[0]);
  } catch (err) {
    const error = err as Error;
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

/**
 * Get all choices for a question
 */
router.get("/:id/choices", async (req: Request, res: Response) => {
  try {
    const questionId = req.params.id;

    const question = await pool.query(
      `SELECT question_text FROM questions WHERE question_id = $1`,
      [questionId]
    );
    if (!question.rowCount) {
      console.error("Invalid question id");
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
});

/**
 * Create a choice for a question
 */
router.post("/:id/choices", async (req: Request, res: Response) => {
  try {
    const questionId = req.params.id;

    const question = await pool.query(
      `SELECT question_text FROM questions WHERE question_id = $1`,
      [questionId]
    );
    if (!question.rowCount) {
      console.error("Invalid question id");
      res.status(404).json({
        message: `Invalid question id`,
      });
      return;
    }

    const { isRightAnswer = false, text } = req.body;
    const newQuestion = await pool.query(
      `INSERT INTO question_choices (
      question_id, is_right_answer, choice_text
    ) VALUES (
      $1, $2, $3
    ) RETURNING *`,
      [questionId, isRightAnswer, text]
    );
    res.json(newQuestion.rows[0]);
  } catch (err) {
    const error = err as Error;
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

export default router;
