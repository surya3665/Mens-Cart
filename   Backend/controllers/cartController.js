import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';

// ─── Get Cart ────────────────────────────────────────────────────────────────
// GET /api/cart
// Returns the current user's cart with populated product details.
export const getCart = async (req, res) => {
  try {
    // Find cart for this user and populate product info for each item
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      'items.product',
      'name price image stock'
    );

    if (!cart) {
      return res.json({ items: [] }); // Return empty cart if none exists
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Add to Cart ──────────────────────────────────────────────────────────────
// POST /api/cart
// Adds a product to the cart. If product already in cart, increases quantity.
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Verify the product actually exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check stock availability
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    // Find or create cart for this user
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if this product is already in the cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity; // Increase quantity
    } else {
      cart.items.push({ product: productId, quantity }); // Add new item
    }

    await cart.save();

    // Return cart with product details populated
    const updatedCart = await Cart.findById(cart._id).populate(
      'items.product',
      'name price image stock'
    );

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Remove from Cart ─────────────────────────────────────────────────────────
// DELETE /api/cart/:productId
// Removes a specific product from the cart entirely.
export const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Filter out the item with the matching product ID
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== req.params.productId
    );

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate(
      'items.product',
      'name price image stock'
    );

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Clear Cart ───────────────────────────────────────────────────────────────
// DELETE /api/cart
// Empties the entire cart (called after placing an order).
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};