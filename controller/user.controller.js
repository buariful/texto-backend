const asyncHandler = require("express-async-handler");
const UserModel = require("../model/user.model");
const generateToken = require("../utils/generateToken");
const ErrorClass = require("../utils/errorClass");
const jwt = require("jsonwebtoken");

exports.resigterUser = async (req, res, next) => {
  const { name, email, password, picture } = req.body;

  if (!name || !email || !password) {
    throw new Error("Please Enter name, email and password");
  }
  const isUserExist = await UserModel.findOne({ email });
  if (isUserExist) {
    return next(
      new ErrorClass("Email is in use. Please use another email.", 409)
    );
  }

  const user = await UserModel.create({ name, email, password, picture });
  if (user) {
    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        picture: user.picture,
        email: user.email,
      },
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("failed to create an user");
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email }).select("+password");

  if (!user) {
    return res.status(400).json({
      success: true,
      message: "User not found or password doesn't matched",
    });
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (user && isPasswordMatched) {
    // Exclude the password field from the user object
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    const token = `Bearer ${generateToken(user._id)}`;

    res.status(200).json({
      success: true,
      data: userWithoutPassword,
      token,
    });
  } else {
    res.status(401).json({
      success: false,
      message: "User not found or password doesn't matched",
    });
  }
};

exports.getUserByToken = async (req, res, next) => {
  const token = req.headers.authorization;
  const tokenString = token?.replace("Bearer ", "");

  if (tokenString) {
    try {
      // Verify the token
      const decoded = jwt.verify(tokenString, process.env.JWT_SECRET);
      const user = await UserModel.findById(decoded.id);

      if (user) {
        res.status(200).json({ success: true, data: user, token: token });
      } else {
        return next(new ErrorClass("User not found ", 400));
      }
    } catch (err) {
      return next(new ErrorClass("User not found ", 400));
    }
  } else {
    return next(new ErrorClass("User not found ", 400));
  }
};

exports.getAllUsers = async (req, res) => {
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
      .json({ success: true, totalUsers: users.length, data: users });
  } else {
    res.status(400).json({ success: false, message: "No user found" });
  }
};
