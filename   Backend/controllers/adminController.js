import Product from '../models/productModel.js';
import User from '../models/userModel.js';
import Order from '../models/orderModel.js';

// ─── Product CRUD ─────────────────────────────────────────────────────────────

// POST /api/admin/products — Add a new product
export const createProduct = async (req, res) => {
  try {
    const { name, price, description, stock, category } = req.body;

    // If an image was uploaded via multer, get its path
    const image = req.file ? `/uploads/${req.file.filename}` : '';

    const product = await Product.create({
      name,
      price,
      description,
      stock,
      category,
      image,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/admin/products/:id — Update an existing product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const { name, price, description, stock, category } = req.body;

    // Update fields if provided
    product.name = name || product.name;
    product.price = price ?? product.price;
    product.description = description || product.description;
    product.stock = stock ?? product.stock;
    product.category = category || product.category;

    // Update image only if a new file was uploaded
    if (req.file) {
      product.image = `/uploads/${req.file.filename}`;
    }

    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/admin/products/:id — Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.deleteOne();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── User Management ──────────────────────────────────────────────────────────

// GET /api/admin/users — Get all registered users
export const getAllUsers = async (req, res) => {
  try {
    // Exclude passwords from response
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Order Management ─────────────────────────────────────────────────────────

// GET /api/admin/orders — Get all orders across all users
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product', 'name')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/admin/orders/:id — Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = req.body.status || order.status;
    const updated = await order.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};