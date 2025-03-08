import express from "express";
import camelcaseKeys from "camelcase-keys";
import pool from "../db.mjs";

const router = express.Router();

/**
 * Get all active questions
 */
router.get("/", async (req, res) => {
  try {
    const allQuestions = await pool.query(
      "SELECT question_id, question_text FROM questions WHERE is_enabled = TRUE;"
    );
    const response = {
      count: allQuestions.rowCount,
      data: allQuestions.rows.map((row) => camelcaseKeys(row, { deep: true })),
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
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
});

export default router;
