/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/userModel');
const { generateToken } = require('../config/jwtToken');
const validateMongodbId = require('../utils/validateMongodbId');
const { refreshGenerateToken } = require('../config/refreshToken');
const sendEmail = require('./emailController');
const { errorHandler } = require('../middlewares/errorHandler');

// Register User
const createUser = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const findUser = await User.findOne({ email });

  if (!findUser) {
    // Create new user
    const newUser = await User.create(req.body);
    res.json({ newUser });
  } else {
    // User already exist
    throw new Error('User Already Exist');
  }
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // check if user exit
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = await refreshGenerateToken(findUser?._id);
    const updateUser = await User.findByIdAndUpdate(
      findUser.id,
      { refreshToken },
      { new: true },
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
  } else {
    throw Error('Invalid Email or Password');
  }
});

// Login Admin
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // check if user admin
  const findAdmin = await User.findOne({ email });
  if (findAdmin === null || findAdmin.role !== 'admin') { res.status(401).json({ message: 'Invalid Email or Password' }); }
  if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
    const refreshToken = await refreshGenerateToken(findAdmin?._id);
    const updateUser = await User.findByIdAndUpdate(
      findAdmin.id,
      { refreshToken },
      { new: true },
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      id: findAdmin?._id,
      firstname: findAdmin?.firstname,
      lastname: findAdmin?.lastname,
      email: findAdmin?.email,
      mobile: findAdmin?.mobile,
      token: generateToken(findAdmin?._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid Email or Password' });
  }
});

// handle Refresh Token
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie) throw new Error('No Refresh Token in Cookies');
  const { refreshToken } = cookie;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error('No matched user');
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error('There is something wrong with refresh token');
    }
    const accessToken = generateToken(user?._id);
    res.json({ accessToken });
  });
});

// GET All User
const getAllUser = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find();
    res.json({ getUsers });
  } catch (error) {
    throw new Error(error);
  }
});

// GET User By ID
const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const user = await User.findById(id);
    res.json({ user });
  } catch (error) {
    throw new Error(error);
  }
});

// UPDATE User By ID
const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongodbId(_id);
  try {
    const user = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      { new: true },
    );
    res.json({ user });
  } catch (error) {
    throw new Error(error);
  }
});

// Save User Address
const saveAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongodbId(_id);
  try {
    const user = await User.findByIdAndUpdate(
      _id,
      { address: req?.body?.address },
      { new: true },
    );
    res.json({ user });
  } catch (error) {
    throw new Error(error);
  }
});

// DELETE User By ID
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const user = await User.findByIdAndDelete(id);
    res.json({ user });
  } catch (error) {
    throw new Error(error);
  }
});

// Block User
const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { isBlocked: true },
      { new: true },
    );
    res.json({ message: 'User is Blocked' });
  } catch (error) {
    throw new Error(error);
  }
});

// unblock User
const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { isBlocked: false },
      { new: true },
    );
    res.json({ message: 'User is Unblocked' });
  } catch (error) {
    throw new Error(error);
  }
});

// Logout User
// eslint-disable-next-line consistent-return
const logoutUser = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  console.log(cookie);
  if (!cookie) throw new Error('No Refresh Token in Cookies');
  const { refreshToken } = cookie;
  try {
    const user = await User.findOne({ refreshToken });
    if (!user) {
      res.clearCookie('refreshToken', { httpOnly: true, secure: true });
      return res.sendStatus(204);
    }
    await User.findOneAndUpdate(refreshGenerateToken, { refreshToken: '' });
    res.clearCookie('refreshToken', { httpOnly: true, secure: true });
    res.json({ message: 'User logout successfully' });
  } catch (error) {
    throw new Error(error);
  }
});

// Change Password User
const updatePasswordUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongodbId(_id);
  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updatedPassword = await user.save();
    res.json(updatedPassword);
  } else {
    res.json(user);
  }
});

// Forgot Password
const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found with this email');
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetURL = `Hi, please follow this link to reset your password. This link is valid till 10 minutes from now. <a href="http://localhost:5000/api/user/reset-password/${token}">Click Here</a>`;
    const data = {
      to: email,
      subject: 'Forgot Password',
      text: 'Hey User',
      html: resetURL,
    };
    sendEmail(data);
    res.json(token);
  } catch (error) {
    throw new Error(error);
  }
});

// Reset Password
const resetPasswordToken = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error('Token Expired, Please try again later');
  user.password = password;
  user.passwordResetExpires = undefined;
  user.passwordResetToken = undefined;
  await user.save();
  res.json(user);
});

// Get User Wishlist
const getWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const findUser = await User.findById(_id).populate('wishlist');
    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createUser,
  loginUser,
  loginAdmin,
  getAllUser,
  getUser,
  updateUser,
  deleteUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logoutUser,
  updatePasswordUser,
  forgotPasswordToken,
  resetPasswordToken,
  getWishlist,
  saveAddress,
};
