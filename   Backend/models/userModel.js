import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,        // No two users can share an email
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],  // Only these two roles are allowed
      default: 'user',
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
);

// ─── Pre-save Hook ────────────────────────────────────────────────────────────
// Before saving a user to DB, hash their password using bcrypt.
// This runs automatically whenever we call user.save()
userSchema.pre('save', async function (next) {
  // Only hash if the password field was actually changed
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10); // 10 rounds = secure & fast balance
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─── Instance Method ──────────────────────────────────────────────────────────
// matchPassword: Compare plain-text password with hashed password in DB
// Used during login to verify credentials
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;