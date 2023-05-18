const express = require("express");
const {
  resigterUser,
  loginUser,
  getAllUsers,
} = require("../controller/user.controller");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/register").post(resigterUser);
router.route("/login").post(loginUser);
router.route("/all-users").get(protect, getAllUsers);

module.exports = router;
