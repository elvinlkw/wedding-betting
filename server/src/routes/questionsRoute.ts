import express from 'express';
import { questionsController } from '../controllers';
import { auth } from '../middleware';
const router = express.Router();

/**
 * Get all active questions
 */
router.get('/', questionsController.getAllQuestions);

/**
 * Create a question
 */
router.post('/', auth, questionsController.create);

/**
 * Get all choices for a question
 */
router.get('/:id/choices', questionsController.getChoicesByQuestionId);

/**
 * Create a choice for a question
 */
router.post('/:id/choices', auth, questionsController.createChoice);

export default router;
