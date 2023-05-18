const express = require("express");
const {
  getAllChats,
  accessOneChat,
} = require("../controller/chat.controller.js");
const { protect } = require("../middleware/authMiddleware.js");
const router = express.Router();

router.route("/chats").get(protect, getAllChats);
router.route("/access-one-chat").post(protect, accessOneChat);

module.exports = router;
