import express, { Request, Response } from "express";
import camelcaseKeys from "camelcase-keys";
import pg from "pg";
import pool from "../db";

const { DatabaseError } = pg;
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const allAnswers = await pool.query("SELECT * FROM user_answers;");
    const response = {
      count: allAnswers.rowCount,
      data: allAnswers.rows.map((row) => camelcaseKeys(row, { deep: true })),
    };
    res.json(response);
  } catch (err) {
    const error = err as Error;
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, answers } = req.body;

    const existUser = await pool.query(
      `SELECT user_id FROM users WHERE first_name=$1 AND last_name=$2`,
      [firstName, lastName]
    );
    if (existUser.rowCount) {
      res.status(409).json({
        message: "A response has already been submitted under this user",
      });
      return;
    }

    const newUser = await pool.query(
      `INSERT INTO users (first_name, last_name) VALUES ($1, $2) RETURNING user_id`,
      [firstName, lastName]
    );
    const userId = newUser.rows[0].user_id;

    const promises = answers.map(
      ({ questionId, choiceId }: { questionId: number; choiceId: number }) => {
        return pool.query(
          `INSERT INTO user_answers (
        user_id, question_id, choice_id
        ) VALUES (
          $1, $2, $3
        ) RETURNING *`,
          [userId, questionId, choiceId]
        );
      }
    );

    await Promise.all(promises);
    res.json({
      message: "Responses submitted successfully",
    });
  } catch (err) {
    const error = err as Error;
    console.error(error.message);

    if (error instanceof DatabaseError && error.code === "23502") {
      res.status(400).json({
        status: "NOT_NULL_VIOLATION",
        statusCode: 400,
        message: `"${error.column}" cannot be empty`,
      });
      return;
    }

    res.status(500).json(error);
  }
});

export default router;
