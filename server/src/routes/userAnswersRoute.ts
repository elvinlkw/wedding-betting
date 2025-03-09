import express from 'express';
import { userAnswersController } from '../controllers';

const router = express.Router();

/**
 * Get list of user answers
 */
router.get('/', userAnswersController.getUserAnswers);

/**
 * Create user answer
 */
router.post('/', userAnswersController.createUserAnswer);

export default router;
