const User = require("../models/userModel")
const asyncHandler = require("express-async-handler")
const { generateToken } = require("../config/jwtToken")

// Register User
const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email
  const findUser = await User.findOne({ email: email })

  if (!findUser) {
    // Create new user
    const newUser = await User.create(req.body)
    res.json(newUser)
  } else {
    // User already exist
    throw new Error("User Already Exist")
  }
})

// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  // check if user exit
  const findUser = await User.findOne({ email })
  if (findUser && (await findUser.isPasswordMatched(password))) {
    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    })
  } else {
    throw Error("Invalid Email or Password")
  }
})

// GET All User
const getAllUser = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find()
    res.json(getUsers)
  } catch (error) {
    throw new Error(error)
  }
})

// GET User By ID
const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params
  try {
    const user = await User.findById(id)
    res.json(user)
  } catch (error) {
    throw new Error(error)
  }
})

// UPDATE User By ID
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params
  try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      { new: true }
    )
    res.json(user)
  } catch (error) {
    throw new Error(error)
  }
})

// DELETE User By ID
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params
  try {
    const user = await User.findByIdAndDelete(id)
    res.json(user)
  } catch (error) {
    throw new Error(error)
  }
})

module.exports = { createUser, loginUser, getAllUser, getUser, updateUser, deleteUser }
