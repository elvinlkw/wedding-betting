import express from 'express';
import cors from 'cors';
import 'dotenv/config.js';
import {
  questionsRoute,
  userAnswersRoute,
  adminUserRoute,
  authRoute,
  scoreboardRoute,
  featuresRoute,
  guestsRoute,
} from './src/routes/index.js';

declare module 'express' {
  interface Request {
    user?: {
      id: string;
    };
  }
}

const app = express();
const port = process.env.PORT || 8080;

// middleware
app.use(cors());
app.use(express.json());

// routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
  });
});

app.use('/api/questions', questionsRoute);
app.use('/api/user-answers', userAnswersRoute);
app.use('/api/admin-user', adminUserRoute);
app.use('/api/auth', authRoute);
app.use('/api/scoreboard', scoreboardRoute);
app.use('/api/features', featuresRoute);
app.use('/api/guests', guestsRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
