import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

// ─── Register ─────────────────────────────────────────────────────────────────
// POST /api/auth/register
// Creates a new user account. Password gets hashed via the pre-save hook in the model.
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if a user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user (password will be hashed by pre-save hook in userModel)
    const user = await User.create({ name, email, password, role });

    // Generate a JWT token for the new user
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Login ────────────────────────────────────────────────────────────────────
// POST /api/auth/login
// Verifies credentials and returns a JWT token.
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare the entered password with the hashed password in DB
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = generateToken(user._id, user.role);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Get Profile ──────────────────────────────────────────────────────────────
// GET /api/auth/profile (Protected)
// Returns the logged-in user's profile data.
export const getProfile = async (req, res) => {
  // req.user is set by the protect middleware
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  });
};