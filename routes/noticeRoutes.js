import express from 'express';
import { 
  getNotices, 
  createNotice, 
  updateNotice, 
  deleteNotice 
} from '../controllers/noticeController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../config/cloudinary.js';

const router = express.Router();

router.route('/')
  .get(getNotices)
  .post(protect, admin, upload.single('file'), createNotice);

router.route('/:id')
  .put(protect, admin, upload.single('file'), updateNotice)
  .delete(protect, admin, deleteNotice);

export default router;
