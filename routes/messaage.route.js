const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  sendMessage,
  getAllMessages,
} = require("../controller/message.controller");

const router = express.Router();

router.route("/message").post(protect, sendMessage);
router.route("/messages/:chatId").get(protect, getAllMessages);

module.exports = router;
