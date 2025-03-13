import express from 'express';
import { questionsController } from '../controllers';
import { auth } from '../middleware';
const router = express.Router();

/**
 * Get all active questions
 */
router.get('/', questionsController.getAllQuestions);

/**
 * Get all admin questions
 */
router.get('/admin', auth, questionsController.getAllAdminQuestions);

/**
 * Create a question
 */
router.post('/', auth, questionsController.create);

/**
 * Update a question
 */
router.put('/:questionId', questionsController.update);

/**
 * Get all choices for a question
 */
router.get('/:id/choices', questionsController.getChoicesByQuestionId);

/**
 * Create choices for a question
 */
router.post('/:id/choices', auth, questionsController.createChoice);

export default router;
