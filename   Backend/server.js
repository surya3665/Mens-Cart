import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// __dirname is not available in ES Modules, so we recreate it
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Middleware ────────────────────────────────────────────────────────────────
// cors: Allows frontend (React) to communicate with this backend
app.use(cors());

// express.json: Parses incoming JSON request bodies (req.body)
app.use(express.json());

// Serve uploaded images as static files from /uploads URL
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);        // Register, Login
app.use('/api/products', productRoutes); // Get all, Get one, Search, Pagination
app.use('/api/cart', cartRoutes);        // Add, Remove, Get cart
app.use('/api/orders', orderRoutes);     // Place order, My orders
app.use('/api/admin', adminRoutes);      // Admin: CRUD products, view users/orders

// ─── Error Handling ───────────────────────────────────────────────────────────
app.use(notFound);      // 404 handler for unknown routes
app.use(errorHandler);  // Global error handler

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});