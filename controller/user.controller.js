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

  if (user && isPasswordMatched) {
    res.status(200).json({
      success: true,
      data: user,
      token: await generateToken(user._id),
    });
  } else {
    res.status(401).json({
      success: false,
      message: "User not found or password doesn't matched",
    });
  }
});

exports.getAllUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  const users = await UserModel.find(keyword).find({
    _id: { $ne: req.user._id },
  });

  if (users.length > 0) {
    res
      .status(200)
      .send({ success: true, totalUsers: users.length, data: users });
  } else {
    res.status(401).send({ success: false, message: "No user found" });
  }
});
