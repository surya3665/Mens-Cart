import mongoose from 'mongoose';

// Sub-schema for each item inside the cart
const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,  // Reference to Product document
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    default: 1,
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,  // Reference to User document
      ref: 'User',
      required: true,
      unique: true,  // One cart per user
    },
    items: [cartItemSchema],  // Array of cart items
  },
  { timestamps: true }
);

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;