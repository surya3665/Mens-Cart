import express from 'express';
import { getProducts, getProductById } from '../controllers/productController.js';

const router = express.Router();

// Public — anyone can browse products
router.get('/', getProducts);         // GET /api/products?search=&page=
router.get('/:id', getProductById);   // GET /api/products/:id

export default router;