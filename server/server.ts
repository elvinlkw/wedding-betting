import express from 'express';
import cors from 'cors';
import 'dotenv/config.js';
import { questionsRoute, userAnswersRoute } from './src/routes/index.js';

const app = express();
const port = process.env.PORT || 8080;

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use('/api/questions', questionsRoute);
app.use('/api/user-answers', userAnswersRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
