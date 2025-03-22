import express from 'express';
import { scoreboardController } from '../controllers';

const router = express.Router();

router.get('/', scoreboardController.getScoreboard);

export default router;
