import express from 'express';
import { userAnswersController } from '../controllers';
import { auth } from '../middleware';

const router = express.Router();

/**
 * Get list of user answers
 */
router.get('/', auth, userAnswersController.getUserAnswers);

/**
 * Create user answer
 */
router.post('/', userAnswersController.createUserAnswer);

export default router;
