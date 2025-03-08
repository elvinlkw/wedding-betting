import express from "express";
import camelcaseKeys from "camelcase-keys";
import pool from "../db.mjs";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const allAnswers = await pool.query(
      "SELECT first_name, last_name FROM user_answers;"
    );
    const response = {
      count: allAnswers.rowCount,
      data: allQuestions.rows.map((row) => camelcaseKeys(row, { deep: true })),
    };
    res.json(response);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, answers } = req.body;

    const existUser = await pool.query(
      `SELECT user_id FROM users WHERE first_name=$1 AND last_name=$2`,
      [firstName, lastName]
    );
    if (existUser.rowCount) {
      return res.status(409).json({
        message: "A response has already been submitted under this user",
      });
    }

    const newUser = await pool.query(
      `INSERT INTO users (first_name, last_name) VALUES ($1, $2) RETURNING user_id`,
      [firstName, lastName]
    );
    const userId = newUser.rows[0].user_id;

    const promises = answers.map(({ questionId, choiceId }) => {
      return pool.query(
        `INSERT INTO user_answers (
        user_id, question_id, choice_id
        ) VALUES (
          $1, $2, $3
        ) RETURNING *`,
        [userId, questionId, choiceId]
      );
    });

    await Promise.all(promises);
    res.json({
      message: "Responses submitted successfully",
    });
  } catch (err) {
    console.error(err.message);

    if (err.code === "23502") {
      return res.status(400).json({
        status: "NOT_NULL_VIOLATION",
        statusCode: 400,
        message: `"${err.column}" cannot be empty`,
      });
    }

    res.status(500).json(err);
  }
});

export default router;
