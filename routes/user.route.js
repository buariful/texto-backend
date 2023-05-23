const express = require("express");
const {
  resigterUser,
  loginUser,
  getAllUsers,
  getUserByToken,
} = require("../controller/user.controller");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/register").post(resigterUser);
router.route("/login").post(loginUser);
router.route("/getuser").get(getUserByToken);
router.route("/users").get(protect, getAllUsers);

module.exports = router;
