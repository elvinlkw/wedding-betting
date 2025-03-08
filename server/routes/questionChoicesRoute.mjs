import express from "express";
import pool from "../db.mjs";
import camelcaseKeys from "camelcase-keys";

const router = express.Router();

/**
 * Get all active questions
 */
router.get("/", async (req, res) => {
  try {
    const allChoices = await pool.query("SELECT * FROM question_choices;");

    const response = {
      count: allChoices.rowCount,
      data: allChoices.rows.map((row) => camelcaseKeys(row, { deep: true })),
    };
    res.json(response);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
});

/**
 * Create a question
 */
router.post("/", async (req, res) => {
  try {
    const { questionId, isRightAnswer = false, text } = req.body;
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
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
});

export default router;
