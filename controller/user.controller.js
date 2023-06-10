const asyncHandler = require("express-async-handler");
const UserModel = require("../model/user.model");
const generateToken = require("../utils/generateToken");
const ErrorClass = require("../utils/errorClass");
const jwt = require("jsonwebtoken");
const cloudinary = require("../utils/cloudinary");

exports.resigterUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password || !req.file) {
    return next(
      new ErrorClass("Please Enter name, email, image and password", 400)
    );
  }

  const isUserExist = await UserModel.findOne({ email });
  if (isUserExist) {
    return next(
      new ErrorClass("Email is in use. Please use another email.", 400)
    );
  }

  let result;
  try {
    result = await cloudinary.uploader.upload(req.file.path, {
      folder: "texto",
      transformation: [{ max_width: 512, max_height: 512 }],
    });
  } catch (error) {
    console.log(error);
  }
  const imageData = {
    url: result?.secure_url,
    publicId: result?.public_id,
  };

  const user = await UserModel.create({
    name,
    email,
    password,
    picture: imageData,
  });
  if (user) {
    res.status(201).json({
      success: true,
      data: user,
      token: `Bearer ${generateToken(user._id)}`,
      message: "Successfully registered",
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
      success: false,
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
      message: "Welcome again",
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

exports.updateProfile = async (req, res, next) => {
  const { name, email, publicId } = req.body;
  if (!name || !email) {
    return next(new ErrorClass("Given data is not enough", 400));
  }
  const isUserExist = await UserModel.findOne({ email });
  if (isUserExist && email !== req.user.email) {
    return next(new ErrorClass("Email is in use, use another email"));
  }

  let updatedData = {
    name,
    email,
  };

  try {
    if (req.file) {
      await cloudinary.uploader.destroy(publicId);
      const result = await cloudinary.uploader.upload(req.file.path, {
        public_id: publicId,
        transformation: [{ max_width: 512, max_height: 512 }],
        max_bytes: 1000000,
        quality: 80,
      });
      updatedData.picture = {
        url: result?.secure_url,
        publicId: result?.public_id,
      };
    }
    const updateProfile = await UserModel.findByIdAndUpdate(
      req.user._id,
      updatedData,
      {
        new: true,
      }
    );
    const userWithoutPassword = updateProfile.toObject();
    delete userWithoutPassword.password;
    const token = `Bearer ${generateToken(updateProfile._id)}`;

    res.status(200).json({
      success: true,
      message: "Successfully updated your profile",
      data: updateProfile,
      token,
    });
  } catch (error) {
    return next(
      new ErrorClass("Profile can not be updated, something went wrong", 400)
    );
  }
};

exports.updatePassword = async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword || !newPassword || !confirmPassword) {
    return next(
      new ErrorClass("Please provide old, new and confirm passwords")
    );
  }
  const user = await UserModel.findById(req.user._id).select("+password");

  const isPasswordMatched = await user.comparePassword(oldPassword);
  if (!isPasswordMatched) {
    return next(new ErrorClass("Old password is incorrect", 400));
  }

  if (newPassword !== confirmPassword) {
    return next(
      new ErrorClass("new and confirm passwords do not matched", 400)
    );
  }
  user.password = newPassword;
  await user.save();

  const userWithoutPassword = user.toObject();
  delete userWithoutPassword.password;
  const token = `Bearer ${generateToken(user._id)}`;

  res.status(200).json({
    success: true,
    data: userWithoutPassword,
    message: "Successfully update your password",
    token,
  });

  // res.status(200).json({ success: true, data: user });
};

// texto/o3xxslhohuqgskt2prnk
