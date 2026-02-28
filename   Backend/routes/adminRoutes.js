import express from 'express';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllUsers,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Both protect and adminOnly are applied to ALL routes in this file
router.use(protect, adminOnly);

// Product management
router.post('/products', upload.single('image'), createProduct);
router.put('/products/:id', upload.single('image'), updateProduct);
router.delete('/products/:id', deleteProduct);

// User & order management
router.get('/users', getAllUsers);
router.get('/orders', getAllOrders);
router.put('/orders/:id', updateOrderStatus);

export default router;