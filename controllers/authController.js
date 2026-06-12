import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import asyncHandler from '../middleware/asyncHandler.js';

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { schoolId, password, role } = req.body;

  // Optional: filter by role if passed
  const query = { schoolId };
  if (role) query.role = role;

  const user = await User.findOne(query);

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      schoolId: user.schoolId,
      role: user.role,
      avatar: user.avatar,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid ID or password' });
  }
});

// @desc    Register a new user (Usually Admin does this, but keeping open for initial setup)
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, schoolId, password, role } = req.body;

  const userExists = await User.findOne({ schoolId });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists with this ID' });
  }

  const user = await User.create({
    name,
    schoolId,
    password,
    role: role || 'student',
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      schoolId: user.schoolId,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
});
