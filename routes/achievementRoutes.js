import express from 'express';
import { 
  getAchievements, 
  createAchievement, 
  updateAchievement,
  deleteAchievement
} from '../controllers/achievementController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../config/cloudinary.js';

const router = express.Router();

router.route('/')
  .get(getAchievements)
  .post(protect, admin, upload.single('image'), createAchievement);

router.route('/:id')
  .put(protect, admin, upload.single('image'), updateAchievement)
  .delete(protect, admin, deleteAchievement);

export default router;
