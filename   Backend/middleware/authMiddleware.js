import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// ─── protect ──────────────────────────────────────────────────────────────────
// Verifies the JWT token from the Authorization header.
// If valid, attaches the user object to req.user for downstream use.
export const protect = async (req, res, next) => {
  let token;

  // Tokens are sent as: Authorization: Bearer <token>
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    // Decode the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user from DB (minus their password) and attach to request
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    next(); // Move to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: 'Token is invalid or expired' });
  }
};

// ─── adminOnly ────────────────────────────────────────────────────────────────
// Used AFTER protect middleware.
// Only allows users with role === 'admin' to proceed.
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admins only' });
  }
};