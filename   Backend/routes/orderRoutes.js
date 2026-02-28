import express from 'express';
import { placeOrder, getMyOrders } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', placeOrder);
router.get('/my', getMyOrders);

export default router;