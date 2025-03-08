import express from "express";
import camelcaseKeys from "camelcase-keys";
import pool from "../db.mjs";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const answers = await pool.query(
      `SELECT 
          u.first_name,
          u.last_name,
          json_agg(
            json_build_object(
              'question_id', ua.question_id,
              'choice_id', ua.choice_id
            )
          ) AS answers
        FROM 
          user_answers ua
        JOIN 
          users u ON ua.user_id = u.user_id
        GROUP BY 
          u.user_id, u.first_name, u.last_name;`
    );
    const camelCasedAnswers = answers.rows.map((row) =>
      camelcaseKeys(row, { deep: true })
    );

    res.json(camelCasedAnswers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

export default router;
