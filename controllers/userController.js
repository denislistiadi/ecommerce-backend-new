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
  const findUser = await User.findOne({email})
  if (findUser && await findUser.isPasswordMatched(password)) {
    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id)
    })
  } else {
    throw Error("Invalid Email or Password")
  }
})

module.exports = { createUser, loginUser }
