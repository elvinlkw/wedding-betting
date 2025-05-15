import express from 'express';
import { userAnswersController } from '../controllers';
import { auth } from '../middleware';
import pool from '../db';

const router = express.Router();

/**
 * Get list of user answers
 */
router.get('/', auth, userAnswersController.getUserAnswers);

/**
 * Create user answer
 */
router.post('/', userAnswersController.createUserAnswer);

// delete user answer
router.delete('/users', auth, async (req, res) => {
  await pool.query('DELETE FROM users ');

  res.json({
    message: 'User answer deleted successfully',
  });
});

export default router;
