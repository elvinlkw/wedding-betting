import express from "express";
import { questionsController } from "../controllers";
const router = express.Router();

/**
 * Get all active questions
 */
router.get("/", questionsController.getAllQuestions);

/**
 * Create a question
 */
router.post("/", questionsController.create);

/**
 * Get all choices for a question
 */
router.get("/:id/choices", questionsController.getChoicesByQuestionId);

/**
 * Create a choice for a question
 */
router.post("/:id/choices", questionsController.createChoice);

export default router;
