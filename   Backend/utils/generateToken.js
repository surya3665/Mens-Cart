import jwt from 'jsonwebtoken';

const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },          // Payload: data embedded inside the token
    process.env.JWT_SECRET,         // Secret key used to sign the token
    { expiresIn: process.env.JWT_EXPIRE || '7d' }  // Token expires in 7 days
  );
};

export default generateToken;