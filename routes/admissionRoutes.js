import express from 'express';
import { submitAdmission } from '../controllers/admissionController.js';

const router = express.Router();

router.post('/submit', submitAdmission);

export default router;
