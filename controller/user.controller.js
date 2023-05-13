const asyncHandler = require("express-async-handler");
const UserModel = require("../model/user.model");
const generateToken = require("../utils/generateToken");

exports.resigterUser = asyncHandler(async (req, res) => {
  const { name, email, password, picture } = req.body;

  if (!name || !email || !password) {
    throw new Error("Please Enter name, email and password");
  }
  const isUserExist = await UserModel.findOne({ email });
  if (isUserExist) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await UserModel.create({ name, email, password, picture });
  if (user) {
    res.status(201).json({
      id: user._id,
      name: user.name,
      password: user.password,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("failed to create an user");
  }
});

exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });
  const isPasswordMatched = await user.comparePassword(password);
  console.log(isPasswordMatched);
  if (user && isPasswordMatched) {
    res.status(200).send(user);
  }
});
