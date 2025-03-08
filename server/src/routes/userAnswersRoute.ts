import express, { Request, Response } from "express";
import camelcaseKeys from "camelcase-keys";
import pg from "pg";
import pool from "../db";

const { DatabaseError } = pg;
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const userId = req.query.userId;

    let query;
    if (userId) {
      const user = await pool.query(
        `SELECT first_name, last_name FROM users WHERE user_id = $1`,
        [userId]
      );
      if (!user.rowCount) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      query = pool.query(
        `
        SELECT 
          ua.question_id,
          q.question_text,
          ua.choice_id,
          qc.choice_text,
          qc.is_right_answer
        FROM user_answers ua
        LEFT JOIN questions q ON q.question_id = ua.question_id
        LEFT JOIN question_choices qc ON qc.choice_id = ua.choice_id
        WHERE ua.user_id = $1`,
        [userId]
      );
      const userAnswers = await query;
      const response = {
        userId: user.rows[0].user_id,
        firstName: user.rows[0].first_name,
        lastName: user.rows[0].last_name,
        answers: userAnswers.rows.map((row) =>
          camelcaseKeys(row, { deep: true })
        ),
      };
      res.json(response);
    } else {
      query = pool.query(`
        SELECT 
          u.user_id,
          u.first_name,
          u.last_name,
          json_agg(
            json_build_object(
              'question_id', ua.question_id,
              'question_text', q.question_text,
              'choice_id', qc.choice_id, 
              'choice_text', qc.choice_text,
              'is_right_answer', qc.is_right_answer
            )
          ) AS answers
        FROM users u
        LEFT JOIN user_answers ua ON u.user_id = ua.user_id
        LEFT JOIN questions q ON q.question_id = ua.question_id
        LEFT JOIN question_choices qc ON qc.choice_id = ua.choice_id
        GROUP BY u.user_id
        `);
      const allAnswers = await query;
      const response = {
        count: allAnswers.rowCount,
        data: allAnswers.rows.map((row) => camelcaseKeys(row, { deep: true })),
      };
      res.json(response);
    }
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
