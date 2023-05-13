const express = require("express");
const { resigterUser, loginUser } = require("../controller/user.controller");
const router = express.Router();

router.route("/register").post(resigterUser);
router.route("/login").post(loginUser);

module.exports = router;
