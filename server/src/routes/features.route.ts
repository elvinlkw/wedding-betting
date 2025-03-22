import express from 'express';
import { featuresController } from '../controllers';
import { auth } from '../middleware';

const router = express.Router();

router.get('/', featuresController.getFeatures);

router.get('/:id', featuresController.getFeature);

router.post('/', auth, featuresController.createFeature);

router.put('/:id', auth, featuresController.updateFeature);

router.patch('/:id', auth, featuresController.patchFeature);

export default router;
