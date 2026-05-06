const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper — creates a JWT with id, role AND name
const generateToken = (id, role, name) => {
  return jwt.sign({ id, role, name }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// POST /api/auth/register
const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide name, email, and password.' });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: 'An account with this email already exists.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });

  res.status(201).json({
    message: 'Account created successfully.',
    token: generateToken(user._id, user.role, user.name), // ✅ name added
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password.' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  res.json({
    message: 'Login successful.',
    token: generateToken(user._id, user.role, user.name), // ✅ name added
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

// GET /api/auth/me  (protected)
const getMe = async (req, res) => {
  res.json({ user: req.user });
};

module.exports = { register, login, getMe };