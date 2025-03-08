import express from "express";
import cors from "cors";
import "dotenv/config.js";
import {
  answersRoute,
  questionsRoute,
  questionChoicesRoute,
  userAnswersRoute,
} from "./routes/index.mjs";

const app = express();
const port = process.env.PORT || 8080;

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/questions", questionsRoute);
app.use("/answers", answersRoute);
app.use("/question-choices", questionChoicesRoute);
app.use("/user-answers", userAnswersRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
