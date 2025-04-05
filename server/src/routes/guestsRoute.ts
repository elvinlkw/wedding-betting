import express from 'express';
import { auth } from '../middleware';
import { guestsController } from '../controllers';

const router = express.Router();

router.get('/', guestsController.getGuests);

export default router;
