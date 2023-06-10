const express = require("express");
const {
  resigterUser,
  loginUser,
  getAllUsers,
  getUserByToken,
  updateProfile,
  updatePassword,
} = require("../controller/user.controller");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");
const router = express.Router();

router.route("/register").post(upload.single("image"), resigterUser);
router.route("/login").post(loginUser);
router.route("/getuser").get(getUserByToken);
router.route("/users").get(protect, getAllUsers);
router.route("/update-password").put(protect, updatePassword);
router
  .route("/update-profile")
  .put(protect, upload.single("image"), updateProfile);

module.exports = router;
