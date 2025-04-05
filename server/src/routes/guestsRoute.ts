import express from 'express';
import { auth } from '../middleware';
import { guestsController } from '../controllers';

const router = express.Router();

router.get('/', guestsController.getGuests);

router.post('/', auth, guestsController.createGuest);

router.put('/:id', auth, guestsController.updateGuest);

router.delete('/:id', auth, guestsController.deleteGuest);

export default router;
