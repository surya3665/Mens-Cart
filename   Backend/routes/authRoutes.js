import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes (no token required)
router.post('/register', register);
router.post('/login', login);

// Protected route (requires valid JWT token)
router.get('/profile', protect, getProfile);

export default router;
