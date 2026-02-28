import Order from '../models/orderModel.js';
import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';

// ─── Place Order ──────────────────────────────────────────────────────────────
// POST /api/orders
// Creates an order from the user's current cart, then clears the cart.
export const placeOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    // Get user's cart with product details
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      'items.product'
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty' });
    }

    // Build order items by snapshotting current product name/price
    // (Important: prices could change later, so we store them at order time)
    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    }));

    // Calculate total price
    const totalPrice = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Create the order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalPrice,
      shippingAddress,
    });

    // Reduce stock for each product
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // Clear the user's cart after successful order
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Get My Orders ────────────────────────────────────────────────────────────
// GET /api/orders/my
// Returns all orders placed by the currently logged-in user.
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name image')
      .sort({ createdAt: -1 }); // Most recent first

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};