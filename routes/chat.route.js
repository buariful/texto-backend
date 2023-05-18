const express = require("express");
const {
  getAllChats,
  getSingleChat,
} = require("../controller/chat.controller.js");
const { protect } = require("../middleware/authMiddleware.js");
const router = express.Router();

router.route("/chat").get(getAllChats);
router.route("/single-chat").get(protect, getSingleChat);

module.exports = router;
